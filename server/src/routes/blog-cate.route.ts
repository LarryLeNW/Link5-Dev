import { createBlogCategory, getBlogCateList } from '@/controllers/blog-cate.controller'
import { requireAuthorizedHook, requireLoginedHook } from '@/hooks/auth.hooks'
import {
  BlogCategoryRes,
  BlogCategoryResType,
  BlogCateListRes,
  BlogCateListResType,
  CreateBlogCategoryBody,
  CreateBlogCategoryBodyType
} from '@/schemaValidations/blog-category.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function blogCateRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{
    Body: CreateBlogCategoryBodyType
    Reply: BlogCategoryResType
  }>(
    '',
    {
      schema: {
        body: CreateBlogCategoryBody,
        response: {
          200: BlogCategoryRes
        }
      }
      //   preValidation: fastify.auth([])
    },
    async (request, reply) => {
      const blogCate = await createBlogCategory(request.body)
      reply.send({
        data: blogCate,
        message: 'Tạo loại blog thành công!'
      })
    }
  )

  fastify.get<{
    Reply: BlogCateListResType
  }>(
    '/',
    {
      schema: {
        response: {
          200: BlogCateListRes
        }
      }
    },
    async (request, reply) => {
      const products = await getBlogCateList()
      reply.send({
        data: products,
        message: 'Lấy danh sách loại blog thành công!'
      })
    }
  )
}
