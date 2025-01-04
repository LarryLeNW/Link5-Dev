import z from 'zod'

export const CreateBlogCategoryBody = z.object({
  name: z.string().min(1).max(256),
  image: z.string().url()
})

export type CreateBlogCategoryBodyType = z.TypeOf<typeof CreateBlogCategoryBody>

export const BlogCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const BlogCategoryRes = z.object({
  data: BlogCategorySchema,
  message: z.string()
})

export type BlogCategoryResType = z.TypeOf<typeof BlogCategoryRes>

export const BlogCateListRes = z.object({
  data: z.array(BlogCategorySchema),
  message: z.string()
})

export type BlogCateListResType = z.TypeOf<typeof BlogCateListRes>

export const UpdateBlogCateBody = CreateBlogCategoryBody
export type UpdateBlogCateBodyType = CreateBlogCategoryBodyType

export const BlogCateParams = z.object({
  id: z.coerce.number()
})
export type BlogCateParamsType = z.TypeOf<typeof BlogCateParams>
