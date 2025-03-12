import { BlogCategoryRes, BlogCategorySchema } from '@/schemaValidations/blog-category.schema'
import { PageRes } from '@/types/page.response.type'
import z from 'zod'

export const CreateBlogBody = z.object({
  title: z.string().min(1).max(256),
  content: z.string().min(1),
  categoryIds: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  description: z.string().optional()
})

export type CreateBlogBodyType = z.TypeOf<typeof CreateBlogBody>

export const UpdateBlogBody = CreateBlogBody.partial()

export type UpdateBlogBodyType = z.TypeOf<typeof UpdateBlogBody>

const AccountSchema = z.object({
  id: z.string(),
  email: z.string()
});

const ProfileSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  coverPhoto: z.string().nullable(),
  bio: z.string().nullable(),
  birthday: z.date().nullable(),
  location: z.string().nullable(),
  createdAt: z.date(),
  accountId: z.string(),
  account: AccountSchema
});

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  views: z.number(),
  description: z.string().nullable(),
  postById: z.string(),
  categories: z.array(z.object({
    category: z.object({
      id: z.string(),
      name: z.string()
    })
  })),
  postBy: z.object({
    id: z.string(),
    name: z.string()
  }),
  emotions: z.object({
    total: z.number(),
    types: z.array(z.string())
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const BlogRes = z.object({
  data: BlogSchema.optional(),
  message: z.string()
})

export type BlogResType = z.TypeOf<typeof BlogRes>

export const BlogPageRes = PageRes(BlogSchema)

export type BlogPageResType = z.TypeOf<typeof BlogPageRes>

export const BlogParams = z.object({
  id: z.coerce.string()
})

export type BlogParamsType = z.TypeOf<typeof BlogParams>