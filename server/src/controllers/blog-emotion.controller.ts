import prisma from '@/database';
import { AccountResType } from '@/schemaValidations/account.schema';
import { BlogEmotionResType, BlogEmotionSchema, CreateBlogEmotionBodyType } from '@/schemaValidations/blog-emotions.schema';
import PageResponse from '@/types/page.response.type';
import z from 'zod';


export const createBlogEmotion = async (data: CreateBlogEmotionBodyType, account: AccountResType["data"]): Promise<BlogEmotionResType['data']> => {

  const result = await prisma.emotionBlog.create({
    data: { ...data, postById: account.id },
    include: {
      postBy: { select: { id: true, name: true, avatar: true } },
    },
  });

  return BlogEmotionSchema.parse(result);
};

export const getBlogEmotionList = async (params: Record<string, any>): Promise<PageResponse<z.infer<typeof BlogEmotionSchema>>> => {
  const page = parseInt(params.page, 10) || 1;
  const pageSize = parseInt(params.pageSize, 10) || 10;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [result, totalCount] = await Promise.all([
    prisma.emotionBlog.findMany({
      where: {
        blogId: params.blogId || undefined,
        commentId: params.commentId || undefined,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        postBy: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.emotionBlog.count({
      where: {
        blogId: params.blogId || undefined,
        commentId: params.commentId || undefined,
      },
    }),
  ]);

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    pageSize,
    data: result,
    message: 'Lấy cảm xúc bài viết thành công',
  };
};
