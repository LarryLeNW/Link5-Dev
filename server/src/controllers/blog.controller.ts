import { postByQuery } from '@/controllers/queryCommon';
import prisma from '@/database';
import { AccountResType } from '@/schemaValidations/account.schema';
import { BlogSchema, CreateBlogBodyType, UpdateBlogBodyType } from '@/schemaValidations/blog.schema';
import PageResponse from '@/types/page.response.type';
import z from 'zod';
import { Prisma } from '@prisma/client';

const blogSelectQuery = {
  select: {
    id: true,
    title: true,
    content: true,
    description: true,
    image: true,
    views: true,
    postById: true,
    createdAt: true,
    updatedAt: true,
    postBy: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        birthday: true,
        location: true,
        createdAt: true,
        accountId: true,
        account: {
          select: {
            id: true,
            email: true
          }
        }
      }
    },
    categories: {
      select: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }
  }
} as const;

type BlogWithRelations = Prisma.BlogGetPayload<typeof blogSelectQuery>;

export const createBlog = async (data: CreateBlogBodyType, account: AccountResType["data"]) => {
  if (!account.profile?.id) {
    throw new Error("Profile not found");
  }

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

  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      content: data.content,
      description: data.description,
      image: data.image,
      postById: account.profile.id,
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
    ...blogSelectQuery
  });

  return {
    ...blog,
    emotions: {
      total: 0,
      types: []
    }
  };
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
      [params.sortBy || "createdAt"]: params.sortOrder || "desc",
    },
    ...blogSelectQuery
  });

  const formattedBlogs = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    content: blog.content,
    description: blog.description,
    image: blog.image,
    views: blog.views,
    postById: blog.postById,
    categories: blog.categories,
    postBy: {
      id: blog.postBy.id,
      name: `${blog.postBy.firstName} ${blog.postBy.lastName}`.trim()
    },
    emotions: {
      total: 0,
      types: []
    },
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt
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

export const getBlogDetail = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    ...blogSelectQuery
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  const emotions = await prisma.emotionBlog.groupBy({
    by: ["type"],
    where: { blogId: id },
    _count: true,
  });

  const totalEmotions = emotions.reduce((acc, curr) => acc + curr._count, 0);

  return {
    ...blog,
    emotions: {
      total: totalEmotions,
      types: emotions.map((e: { type: string; _count: number }) => ({
        type: e.type,
        count: e._count,
      })),
    },
  };
};

export const deleteBlog = (blogId: string) => {
  return prisma.$transaction([
    prisma.blogToCategory.deleteMany({
      where: { blogId },
    }),
    prisma.blogToTag.deleteMany({
      where: { blogId },
    }),
    prisma.blog.delete({
      where: { id: blogId },
    }),
  ]);
}

export const updateBlog = async (
  id: string,
  data: UpdateBlogBodyType,
  account: AccountResType["data"]
) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { postById: true },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  if (!account.profile?.id || blog.postById !== account.profile.id) {
    throw new Error("Unauthorized");
  }

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

  await prisma.blogToCategory.deleteMany({
    where: { blogId: id },
  });

  await prisma.blogToTag.deleteMany({
    where: { blogId: id },
  });

  const updateData: Prisma.BlogUpdateInput = {
    title: data.title,
    content: data.content,
    description: data.description,
    image: data.image,
  };

  if (data.categoryIds && data.categoryIds.length > 0) {
    updateData.categories = {
      create: data.categoryIds.map((categoryId: string) => ({
        category: { connect: { id: categoryId } },
      })),
    };
  }

  if (tagIds.length > 0) {
    updateData.tags = {
      create: tagIds.map((tagId: string) => ({
        tag: { connect: { id: tagId } },
      })),
    };
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: updateData,
    ...blogSelectQuery
  });

  return {
    ...updatedBlog,
    emotions: {
      total: 0,
      types: [],
    },
  };
};
