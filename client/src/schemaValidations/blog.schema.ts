import z from 'zod'


export const CreateBlogBody = z.object({
  title: z.string().min(16, "ít nhất 16 kí tự").max(256),
  content: z.string().min(1),
  categoryIds: z.preprocess(
    (val) => (val instanceof Set ? Array.from(val) : val),
    z.array(z.string())
  ),
  image: z.string().url(),
  description: z.string().min(30).optional()
})

export const DemoBody = z.object({
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
});
export type DemoBodyType = z.TypeOf<typeof DemoBody>



export type CreateBlogBodyType = z.TypeOf<typeof CreateBlogBody>

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
