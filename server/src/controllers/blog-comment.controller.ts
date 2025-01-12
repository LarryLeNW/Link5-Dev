import prisma from '@/database';
import { BlogCommentSchema, CreateBlogCommentBodyType, BlogCommentResType } from '@/schemaValidations/blog-comment.schema';
import PageResponse, { PageRes } from '@/types/page.response.type';
import z from 'zod';

export const createBlogComment = async (data: CreateBlogCommentBodyType): Promise<BlogCommentResType['data']> => {
  const result = await prisma.commentBlog.create({
    data,
    include: {
      postBy: { select: { id: true, name: true, avatar: true } },
      parent: { select: { id: true, content: true } },
    },
  });

  return BlogCommentSchema.parse(result);
};

export const getBlogCommentList = async (params: Record<string, any>): Promise<PageResponse<z.infer<typeof BlogCommentSchema>>> => {
  const { page = 1, pageSize = 10 } = {
    page: parseInt(params.page, 10) || 1,
    pageSize: parseInt(params.pageSize, 10) || 10,
  };
  const skip = (+page - 1) * +pageSize;
  const take = pageSize;

  const totalCount = await prisma.commentBlog.count();

  const result = await prisma.commentBlog.findMany({
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      postBy: { select: { id: true, name: true, avatar: true } },
      _count: {
        select: { replies: true, emotions: true },
      },
    },
  });

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    pageSize,
    data: result,
    message: 'Lấy bình luận thành công',
  };

};
