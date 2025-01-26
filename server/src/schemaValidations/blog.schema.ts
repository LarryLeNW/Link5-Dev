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
export type UpdateBlogBodyType = CreateBlogBodyType;
export const UpdateBlogBody = CreateBlogBody;

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  views: z.number(),
  description: z.string().nullable(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  postBy: z.object({ id: z.string(), name: z.string() }),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const BlogRes = z.object({
  data: BlogSchema.optional(),
  message: z.string()
})

export type BlogResType = z.TypeOf<typeof BlogRes>

export const BlogPageRes = PageRes(BlogSchema);

export const BlogParams = z.object({
  id: z.coerce.string()
})
export type BlogParamsType = z.TypeOf<typeof BlogParams>