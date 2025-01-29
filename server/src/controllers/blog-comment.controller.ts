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
  const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;

  const whereCondition: Record<string, any> = {
    ...(params.blogId && { blogId: params.blogId }),
  };

  if (params.parentId !== undefined) {
    whereCondition.parentId = params.parentId;
  } else {
    whereCondition.OR = [
      { parentId: null },
      { parentId: { not: { isSet: true } } },
    ]
  }

  const totalCount = await prisma.commentBlog.count({
    where: whereCondition,
  });

  const result = await prisma.commentBlog.findMany({
    skip: (+page - 1) * +pageSize,
    take: +pageSize,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      postBy: { select: { id: true, name: true, avatar: true } },
      _count: {
        select: {
          replies: true,
        },
      },
      emotions: {
        select: { id: true, type: true, postBy: { select: { name: true, avatar: true, id: true } } }, take: 10, orderBy: {
          createdAt: "desc"
        }
      }
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
