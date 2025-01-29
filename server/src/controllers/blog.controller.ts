import prisma from '@/database';
import { AccountResType } from '@/schemaValidations/account.schema';
import { BlogSchema, CreateBlogBodyType, UpdateBlogBodyType } from '@/schemaValidations/blog.schema';
import PageResponse from '@/types/page.response.type';
import z from 'zod';

export const createBlog = async (data: CreateBlogBodyType, account: AccountResType["data"]) => {
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
      postById: account.id,
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
      [params.sortBy || "createdAt"]: params.sortOrder || "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      description: true,
      image: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      postBy: { select: { id: true, name: true } },
      categories: {
        select: {
          category: { select: { id: true, name: true } }
        }
      },
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

export const getBlogDetail = async (id: string) => {
  return await prisma.blog.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      id: true,
      title: true,
      content: true,
      description: true,
      image: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      postBy: { select: { id: true, name: true } },
      categories: {
        select: {
          category: { select: { id: true, name: true } }
        }
      },
      tags: { select: { tag: { select: { id: true, name: true } } } },
    },
  }).then(result => ({
    ...result,
    categories: result.categories?.map((relation) => relation.category),
    tags: result.tags?.map((relation) => relation.tag),
  })).then(async (res) => {
    const emotionStats = await prisma.emotionBlog.groupBy({
      by: ['type'],
      where: {
        blogId: id
      },
      _count: {
        type: true
      }
    });

    const total = emotionStats.reduce((total, emotion) => total + emotion._count.type, 0);
    const types = emotionStats.map((emotion) => emotion.type);
    return { ...res, emotions: { total, types } }
  })
}

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

export const updateBlog = async (id: string, data: UpdateBlogBodyType) => {
  const tagIds = data.tags
    ? await Promise.all(
      data.tags.map(async (name) => {
        const tag = await prisma.tagBlog.upsert({
          where: { name },
          create: { name },
          update: {},
          select: { id: true },
        });
        return tag.id;
      })
    )
    : [];

  return prisma.$transaction(async (prisma) => {
    if (data.categoryIds) {
      await prisma.blogToCategory.deleteMany({ where: { blogId: id } });
      await prisma.blogToCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({
          blogId: id,
          categoryId,
        })),
      });
    }

    if (data.tags) {
      await prisma.blogToTag.deleteMany({ where: { blogId: id } });
      await prisma.blogToTag.createMany({
        data: tagIds.map((tagId) => ({
          blogId: id,
          tagId,
        })),
      });
    }

    return prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
      },
      include: {
        categories: { select: { category: { select: { id: true, name: true } } } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
        postBy: true,
      },
    }).then(blogUpdate => (
      {
        ...blogUpdate,
        categories: blogUpdate.categories.map((relation) => ({
          id: relation.category.id,
          name: relation.category.name,
        })),
        tags: blogUpdate.tags.map((relation) => ({
          id: relation.tag.id,
          name: relation.tag.name,
        })),
      }
    ))
  });
};

