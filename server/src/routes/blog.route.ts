import { createBlog, getBlogList } from '@/controllers/blog.controller'
import { requireLoginedHook } from '@/hooks/auth.hooks'
import {
  CreateBlogBody,
  CreateBlogBodyType,
  BlogRes,
  BlogResType,
  BlogPageRes,
  BlogSchema
} from '@/schemaValidations/blog.schema'
import PageResponse, { PageRes } from '@/types/page.response.type'
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
      const blog = await createBlog(request.body)
      reply.send({
        data: blog,
        message: 'Tạo blog thành công!'
      })
    }
  )

  fastify.get<{
    Querystring:  Record<string, any>,
    Reply: PageResponse<z.infer<typeof BlogSchema>>
  }>(
    '/',
    {
      schema: {
        response: {
          200:  BlogPageRes
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
}
