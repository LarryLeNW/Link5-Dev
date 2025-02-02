import { createBlogComment, getBlogCommentList } from '@/controllers/blog-comment.controller'
import { createBlogEmotion, getBlogEmotionList } from '@/controllers/blog-emotion.controller'
import { requireLoginedHook } from '@/hooks/auth.hooks'
import { BlogCommentRes, BlogCommentResType, BlogCommentSchema, CreateBlogCommentBody, CreateBlogCommentBodyType } from '@/schemaValidations/blog-comment.schema'
import { BlogEmotionRes, BlogEmotionResType, BlogEmotionSchema, CreateBlogEmotionBody, CreateBlogEmotionBodyType } from '@/schemaValidations/blog-emotions.schema'
import PageResponse, { PageRes } from '@/types/page.response.type'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import z from 'zod'

export default async function blogEmotionRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post<{
        Body: CreateBlogEmotionBodyType
        Reply: BlogEmotionResType
    }>(
        '',
        {
            schema: {
                body: CreateBlogEmotionBody,
                response: {
                    200: BlogEmotionRes
                }
            },
            preValidation: fastify.auth([requireLoginedHook])
        },
        async (request, reply) => {
            if (!request.account) {
                return reply.status(401).send({ message: "Not Permission Denied" })
            }
            const data = await createBlogEmotion(request.body, request.account)
            reply.send({
                data: data,
                message: 'Thả cảm xúc thành công!'
            })
        }
    )

    fastify.get<{
        Querystring: Record<string, any>,
        Reply: PageResponse<z.infer<typeof BlogEmotionSchema>>
    }>(
        '/',
        {
            schema: {
                response: {
                    200: PageRes(BlogEmotionSchema)
                }
            }
        },
        async (request, reply) => {
            const data = await getBlogEmotionList(request.query)
            reply.send(
                data
            )
        }
    )

}
