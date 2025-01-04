import prisma from '@/database';
import { CreateBlogBodyType } from '@/schemaValidations/blog.schema';

export const createBlog = async (data: CreateBlogBodyType) => {
  return prisma.blog.create({
    data: {
      title: data.title,
      content: data.content,
      postById: data.postById,
      categories: {
        connect: data.categoryIds.map((id) => ({ id }))
      }
    },
    include: {
      categories: true,
      postBy: true
    }
  });
};

export const getBlogList = async () => {
  return prisma.blog.findMany({
    include: {
      categories: true,
      postBy: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
