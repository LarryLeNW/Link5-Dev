import z from 'zod'

export const CreateBlogCommentBody = z.object({
  content: z.string().min(1).max(256),
  blogId: z.string(),
  postById: z.string(),
  parentId: z.string().optional(),
})

export type CreateBlogCommentBodyType = z.TypeOf<typeof CreateBlogCommentBody>

export const BlogCommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  postBy: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable()
  }),
  emotions: z.array(z.object({
    id: z.string(),
    postBy: z.object({ id: z.string(), name: z.string().optional(), avatar: z.string().url().optional() }),
    type: z.string(),
  })).optional(),
  _count: z.lazy(() => z.object({ replies: z.number(), emotions: z.number() })).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const BlogCommentRes = z.object({
  data: BlogCommentSchema,
  message: z.string()
})

export type BlogCommentResType = z.TypeOf<typeof BlogCommentRes>

