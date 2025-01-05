import prisma from '@/database';
import { BlogResType, BlogSchema, CreateBlogBodyType } from '@/schemaValidations/blog.schema';
import PageResponse from '@/types/page.response.type';
import { TagBlog } from '@prisma/client';
import z from 'zod';

export const createBlog = async (data: CreateBlogBodyType) => {
  const tagIds = await Promise.all(
    (data.tags || []).map(async (name) => {
      const tag = await prisma.tagBlog.upsert({
        where: { name },
        create: { name },
        update: {},
        select: { id: true },
      });
      return tag.id;
    })
  );

  return prisma.blog.create({
    data: {
      title: data.title,
      content: data.content,
      postById: data.postById,
      categories: {
        create: data.categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },
      tags: {
        create: tagIds.map((id) => ({
          tag: { connect: { id } },
        })),
      }
    },
    include: {
      categories: { select: { category: { select: { id: true, name: true } } } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
      postBy: true,
    },
  }).then(blogCreated =>
  ({
    ...blogCreated,
    categories: blogCreated.categories.map((relation) => ({
      id: relation.category.id,
      name: relation.category.name,
    })),
    tags: blogCreated.tags.map((relation) => ({
      id: relation.tag.id,
      name: relation.tag.name,
    })),
  })
  );

};

export const getBlogList = async (params: Record<string, any>): Promise<PageResponse<z.infer<typeof BlogSchema>>> => {
  const { page = 1, pageSize = 10 } = {
    page: parseInt(params.page, 10) || 1, 
    pageSize: parseInt(params.pageSize, 10) || 10,
  };
  const skip = (+page - 1) * +pageSize;
  const take = pageSize;

  const totalCount = await prisma.blog.count();
  const blogs = await prisma.blog.findMany({
    skip,
    take,
    orderBy: {
      [params.sortBy || "createdAt" ]: params.sortOrder || "desc", 
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      postBy: { select: { id: true, name: true } },
      categories: { select: { category: { select: { id: true, name: true } } } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
    },
  });

  const formattedBlogs = blogs.map((blog) => ({
    ...blog,
    categories: blog.categories?.map((relation) => relation.category),
    tags: blog.tags?.map((relation) => relation.tag),
  }));

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    pageSize,
    data: formattedBlogs,
    message: "Lấy danh sách blogs thành công!",
  };
};
