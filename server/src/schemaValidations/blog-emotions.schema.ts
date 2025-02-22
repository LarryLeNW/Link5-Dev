import z from 'zod'

export const CreateBlogEmotionBody = z.object({
  type: z.string().min(1).max(256),
  blogId: z.string().optional(),
  commentId: z.string().optional(),
}).refine(
  data => !(data.blogId && data.commentId),
  { message: 'Thiếu params ...' }
);

export type CreateBlogEmotionBodyType = z.TypeOf<typeof CreateBlogEmotionBody>

export const BlogEmotionSchema = z.object({
  id: z.string(),
  type: z.string(),
  postBy: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable()
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const BlogEmotionRes = z.object({
  data: BlogEmotionSchema.nullable().optional(),
  message: z.string()
})

export type BlogEmotionResType = z.TypeOf<typeof BlogEmotionRes>

