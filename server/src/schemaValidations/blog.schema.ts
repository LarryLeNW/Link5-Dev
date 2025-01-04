import z from 'zod';

export const CreateBlogBody = z.object({
  title: z.string().min(1).max(256),
  content: z.string().min(1),
  categoryIds: z.array(z.number()),
  postById: z.number() 
});

export type CreateBlogBodyType = z.TypeOf<typeof CreateBlogBody>;

export const BlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  categories: z.array(z.object({ id: z.number(), name: z.string() })),
  postBy: z.object({ id: z.number(), name: z.string() }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const BlogRes = z.object({
  data: BlogSchema,
  message: z.string()
});

export type BlogResType = z.TypeOf<typeof BlogRes>;

export const BlogListRes = z.object({
  data: z.array(BlogSchema),
  message: z.string()
});

export type BlogListResType = z.TypeOf<typeof BlogListRes>;
