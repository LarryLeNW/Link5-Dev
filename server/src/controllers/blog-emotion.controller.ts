import { postByQuery } from '@/controllers/queryCommon';
import prisma from '@/database';
import { AccountResType } from '@/schemaValidations/account.schema';
import { BlogEmotionResType, BlogEmotionSchema, CreateBlogEmotionBodyType } from '@/schemaValidations/blog-emotions.schema';
import PageResponse from '@/types/page.response.type';
import z from 'zod';

export const createOrUpdateBlogEmotion = async (
  data: CreateBlogEmotionBodyType,
  account: AccountResType["data"]
): Promise<BlogEmotionResType["data"]> => {
  const { blogId, type, commentId } = data;
  const postById = account.id;

  const whereCondition = { postById, ...(blogId && { blogId }), ...(commentId && { commentId }) };

  const existingEmotion = await prisma.emotionBlog.findFirst({
    where: whereCondition,
    include: { postBy: postByQuery },
  });

  if (!!existingEmotion) {
    if (existingEmotion.type === type) return formatEmotion(existingEmotion);

    return updateBlogEmotion(existingEmotion.id, type);
  }
  return createBlogEmotion(data, postById);
};

const updateBlogEmotion = async (id: string, newType: string) => {
  const emotion = await prisma.emotionBlog.update({
    where: { id },
    data: { type: newType },
    include: { postBy: postByQuery },
  });

  return formatEmotion(emotion);
};

const createBlogEmotion = async (data: CreateBlogEmotionBodyType, postById: string) => {
  const emotion = await prisma.emotionBlog.create({
    data: { ...data, postById },
    include: { postBy: postByQuery },
  });

  return formatEmotion(emotion);
};

const formatEmotion = (emotion: any) => BlogEmotionSchema.parse(emotion);

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
        postBy: postByQuery,
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

export const getBlogEmotionDetail = async (params: Record<string, any>, account: AccountResType["data"]) => {
  const { blogId, commentId } = params;

  const whereCondition = {
    postById: account.id,
    ...(blogId && { blogId }),
    ...(commentId && { commentId })
  };

  return await prisma.emotionBlog.findFirst({
    where: whereCondition
  })
}

export const deleteBlogEmotion = async (id: string) => {
  return await prisma.emotionBlog.delete({
    where: {
      id
    }
  })
}