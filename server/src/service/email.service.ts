import envConfig from "@/config"
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: envConfig.SMTP_HOST,
    port: Number(envConfig.SMTP_PORT),
    secure: false,
    auth: {
        user: envConfig.SMTP_EMAIL,
        pass: envConfig.SMTP_PASSWORD
    }
})

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const mailOptions = {
            from: `"Support Team" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html
        }

        const result = await transporter.sendMail(mailOptions)
        console.log("🚀 ~ sendEmail ~ result:", result)
    } catch (error) {
        console.error(` Gửi email thất bại:`, error)
        throw new Error('Không thể gửi email')
    }
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `${envConfig.FRONTEND_URL}/verify-email?token=${token}`

    const htmlContent = `
    <h2>Xác thực tài khoản của bạn</h2>
    <p>Nhấp vào liên kết sau để xác thực email:</p>
    <a href="${verificationLink}">${verificationLink}</a>
    <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
  `
    await sendEmail(email, 'Xác thực tài khoản', htmlContent)
}
