import { createBlog, deleteBlog, getBlogList, updateBlog } from '@/controllers/blog.controller'
import { requireLoginedHook } from '@/hooks/auth.hooks'
import { AccountRes } from '@/schemaValidations/account.schema'
import { UpdateBlogCateBody } from '@/schemaValidations/blog-category.schema'
import {
  CreateBlogBody,
  CreateBlogBodyType,
  BlogRes,
  BlogResType,
  BlogPageRes,
  BlogSchema,
  UpdateBlogBodyType,
  UpdateBlogBody
} from '@/schemaValidations/blog.schema'
import { MessageRes, MessageResType } from '@/schemaValidations/common.schema'
import PageResponse, { PageRes } from '@/types/page.response.type'
import { AuthError } from '@/utils/errors'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import z from 'zod'

export default async function blogRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{
    Body: CreateBlogBodyType
    Reply: BlogResType
  }>(
    '/',
    {
      schema: {
        body: CreateBlogBody,
        response: {
          200: BlogRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      if (!request.account) {
        return reply.status(401).send({ message: "Not Permission Denied" })
      }
      const blog = await createBlog(request.body, request.account)
      reply.send({
        data: blog,
        message: 'Tạo blog thành công!'
      })
    }
  )

  fastify.get<{
    Querystring: Record<string, any>,
    Reply: PageResponse<z.infer<typeof BlogSchema>>
  }>(
    '/',
    {
      schema: {
        response: {
          200: PageRes(BlogSchema)
        }
      }
    },
    async (request, reply) => {
      const data = await getBlogList(request.query)
      reply.send(
        data
      )
    }
  )

  fastify.delete<{
    Params: { id: string }
    Reply: MessageResType
  }>(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.coerce.string()
        }),
        response: {
          200: MessageRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      await deleteBlog(request.params.id)
      reply.send({
        message: 'Xóa bài viết thành công!'
      })
    }
  )

  fastify.put<{
    Params: { id: string }
    Body: UpdateBlogBodyType
    Reply: BlogResType
  }>(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.coerce.string()
        }),
        body: UpdateBlogBody,
        response: {
          200: BlogRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const blogUpdated = await updateBlog(request.params.id, request.body)
      reply.send({
        data: blogUpdated,
        message: 'Cập nhật sản phẩm thành công!'
      })
    }
  )
}
