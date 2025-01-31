import { createBlogComment, getBlogCommentList } from '@/controllers/blog-comment.controller'
import { requireAuthorizedHook, requireLoginedHook } from '@/hooks/auth.hooks'
import { BlogCommentRes, BlogCommentResType, BlogCommentSchema, CreateBlogCommentBody, CreateBlogCommentBodyType } from '@/schemaValidations/blog-comment.schema'
import PageResponse, { PageRes } from '@/types/page.response.type'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import z from 'zod'

export default async function blogCommentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post<{
        Body: CreateBlogCommentBodyType
        Reply: BlogCommentResType
    }>(
        '',
        {
            schema: {
                body: CreateBlogCommentBody,
                response: {
                    200: BlogCommentRes
                }
            },
            preValidation: fastify.auth([requireLoginedHook])
        },
        async (request, reply) => {
            if (!request.account) {
                return reply.status(401).send({ message: "Not Permission Denied" })
            }
            const data = await createBlogComment(request.body, request.account)
            reply.send({
                data: data,
                message: 'Bình luận thành công!'
            })
        }
    )

    fastify.get<{
        Querystring: Record<string, any>,
        Reply: PageResponse<z.infer<typeof BlogCommentSchema>>
    }>(
        '/',
        {
            schema: {
                response: {
                    200: PageRes(BlogCommentSchema)
                }
            }
        },
        async (request, reply) => {
            const data = await getBlogCommentList(request.query)
            reply.send(
                data
            )
        }
    )

}
