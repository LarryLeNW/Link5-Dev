import z from 'zod'


export const CreateBlogBody = z.object({
  title: z.string()
    .min(16, "Tiêu đề phải có ít nhất 16 ký tự")
    .max(256, "Tiêu đề không được vượt quá 256 ký tự"),
  description: z.string()
    .min(30, "Mô tả phải có ít nhất 30 ký tự")
    .optional(),
  categoryIds: z.preprocess(
    (val) => (val instanceof Set ? Array.from(val) : val),
    z.array(z.string(), {
      required_error: "Danh mục là bắt buộc",
    }).min(1, "Bạn phải chọn ít nhất một loại bài viết")
  ),
  content: z.string().min(16),
  image: z.string().url().optional(),
})

export type CreateBlogBodyType = z.TypeOf<typeof CreateBlogBody>

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
