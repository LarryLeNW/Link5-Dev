import prisma from '@/database'
import { CreateBlogCategoryBodyType } from '@/schemaValidations/blog-category.schema'

export const getBlogCateList = () => {
  return prisma.blogCategory.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const createBlogCategory = (data: CreateBlogCategoryBodyType) => {
  return prisma.blogCategory.create({
    data
  })
}
