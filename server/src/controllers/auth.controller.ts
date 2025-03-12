import envConfig from '@/config'
import { PrismaErrorCode } from '@/constants/error-reference'
import prisma from '@/database'
import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { sendEmail, sendVerificationEmail } from '@/service/email.service'
import { comparePassword, generateRandomUUID, hashPassword } from '@/utils/crypto'
import { EntityError, ForbiddenError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { signSessionToken, verifySessionToken } from '@/utils/jwt'
import { addMilliseconds, isBefore } from 'date-fns'
import jwt from "jsonwebtoken";
import ms from 'ms'

export const registerController = async (body: RegisterBodyType) => {
  try {
    const hashedPassword = await hashPassword(body.password)
    const verificationToken = await generateRandomUUID()
    const verificationTokenExpiresAt = addMilliseconds(new Date(), ms('1h'))

    await prisma.account.create({
      data: {
        email: body.email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt,
        profile: {
          create: {
            firstName: body.firstName,
            lastName: body.lastName,
          }
        }
      },
    })

    sendVerificationEmail(body.email, verificationToken)

    return "Đăng kí thành công"

  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([{ field: 'email', message: 'Email đã tồn tại' }])
      }
    }

    throw error
  }
}

export const verifyController = async (token: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        verificationToken: token,
        status: "pending",
        isVerified: false,
      }
    })

    if (!account) {
      throw new EntityError([{ field: 'token', message: 'Token không hợp lệ hoặc đã được sử dụng' }])
    }

    if (!account.verificationTokenExpiresAt || isBefore(account.verificationTokenExpiresAt, new Date())) {
      throw new EntityError([{ field: 'token', message: 'Token đã hết hạn' }])
    }

    const accountUpdated = await prisma.account.update({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        profile: true
      },
      where: { id: account.id },
      data: {
        status: "active",
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null
      },
    })

    const sessionToken = signSessionToken({
      userId: accountUpdated.id
    })
    const expiresAt = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))

    const session = await prisma.session.create({
      data: {
        accountId: account.id,
        token: sessionToken,
        expiresAt
      }
    })

    return {
      account: accountUpdated,
      session
    }
  } catch (error: any) {
    throw error
  }
}

export const logoutController = async (sessionToken: string) => {
  await prisma.session.delete({
    where: {
      token: sessionToken
    }
  })
  return 'Đăng xuất thành công'
}

/**
 * Tăng thời gian hết hạn của session token lên
 * @param sessionToken
 */
export const slideSessionController = async (sessionToken: string) => {
  const expiresAt = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))
  const session = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      expiresAt
    }
  })
  return session
}

export const loginController = async (body: LoginBodyType) => {
  const account = await prisma.account.findUnique({
    where: {
      email: body.email
    },
    include: {
      profile: true
    }
  })
  if (!account) {
    throw new EntityError([{ field: 'email', message: 'Email không tồn tại' }])
  }
  const isPasswordMatch = await comparePassword(body.password, account.password)
  if (!isPasswordMatch) {
    throw new EntityError([{ field: 'password', message: 'Email hoặc mật khẩu không đúng' }])
  }
  const sessionToken = signSessionToken({
    userId: account.id
  })
  const expiresAt = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))

  const session = await prisma.session.create({
    data: {
      accountId: account.id,
      token: sessionToken,
      expiresAt
    }
  })
  return {
    account,
    session
  }
}



export const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.account.findUnique({ where: { email } });

    if (!user) {
      return "Email không tồn tại trong hệ thống!"
    }

    const token = signSessionToken({ userId: user.id })

    console.log("🚀 ~ forgotPassword ~ token:", token)
    const resetLink = `${envConfig.FRONTEND_URL}/reset-password?token=${token}`;

    const htmlContent = `
            <h2>Đặt lại mật khẩu của bạn</h2>
            <p>Nhấp vào liên kết sau để đặt lại mật khẩu:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        `;

    await sendEmail(email, "Đặt lại mật khẩu", htmlContent);

    return "Email đặt lại mật khẩu đã được gửi!"
  } catch (error) {
    throw error
  }
}


export const resetPassword = async (body: any) => {
  try {
    const { token, newPassword } = body;

    let decoded;
    try {
      decoded = verifySessionToken(token);
    } catch (error) {
      throw new ForbiddenError("Token không hợp lệ ")
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.account.update({
      where: { id: String(decoded.userId) },
      data: { password: hashedPassword },
    });

    return "Mật khẩu đã được cập nhật thành công!"
  } catch (error) {
    throw error;
  }


};