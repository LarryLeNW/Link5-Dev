import z from 'zod'

export const CreateBlogEmotionBody = z.object({
  type: z.string().min(1).max(256),
  blogId: z.string().optional(),
  commentId: z.string().optional(),
}).refine(data => data.blogId || data.commentId, {
  message: 'Yêu cầu blogId hoặc commentId',
})
  .refine(
    data => !(data.blogId && data.commentId),
    { message: 'Chỉ được truyền blogId hoặc commentId' }
  );

export type CreateBlogEmotionBodyType = z.TypeOf<typeof CreateBlogEmotionBody>

export const BlogEmotionSchema = z.object({
  id: z.string(),
  type: z.string(),
  postBy: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable()
  }),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const BlogEmotionRes = z.object({
  data: BlogEmotionSchema,
  message: z.string()
})

export type BlogEmotionResType = z.TypeOf<typeof BlogEmotionRes>

