import z from 'zod'

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  views: z.number(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  postBy: z.object({ id: z.string(), name: z.string() }),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const BlogRes = z.object({
  data: BlogSchema,
  message: z.string()
})

export type BlogResType = z.TypeOf<typeof BlogRes>

export const BlogListRes = z.object({
  data: z.array(BlogSchema),
  totalPages: z.number(),
  message: z.string()
})

export type BlogListResType = z.TypeOf<typeof BlogListRes>
