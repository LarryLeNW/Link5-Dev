import z from 'zod'

export const RegisterBody = z
  .object({
    firstName: z.string().trim().min(2).max(256),
    lastName: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    account: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
      status: z.string(),
      profile: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        avatar: z.string().nullable(),
        coverPhoto: z.string().nullable(),
        bio: z.string().nullable(),
        birthday: z.date().nullable(),
        location: z.string().nullable(),
        createdAt: z.date(),
      }).nullable().optional()
    })
  }),
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const ResetBody = z
  .object({
    token: z.string(),
    newPassword: z.string().min(6).max(100)
  })
  .strict()

export type ResetBodyType = z.TypeOf<typeof ResetBody>

export const LoginRes = RegisterRes

export type LoginResType = z.TypeOf<typeof LoginRes>
export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
export const SlideSessionRes = RegisterRes

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>
