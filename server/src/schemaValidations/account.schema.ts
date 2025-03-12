import z from 'zod'

export const AccountRes = z
  .object({
    data: z.object({
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
      }).optional().nullable()
    }),
    message: z.string()
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256)
})

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>
