import { createOrUpdateBlogEmotion, deleteBlogEmotion, getBlogEmotionDetail, getBlogEmotionList } from '@/controllers/blog-emotion.controller'
import { requireLoginedHook } from '@/hooks/auth.hooks'
import { BlogEmotionRes, BlogEmotionResType, BlogEmotionSchema, CreateBlogEmotionBody, CreateBlogEmotionBodyType } from '@/schemaValidations/blog-emotions.schema'
import { MessageRes, MessageResType } from '@/schemaValidations/common.schema'
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
            const data = await createOrUpdateBlogEmotion(request.body, request.account)
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

    fastify.get<{
        Querystring: Record<string, any>,
        Reply: BlogEmotionResType
    }>(
        '/selected',
        {
            schema: {
                response: {
                    200: BlogEmotionRes
                }
            }
            ,
            preValidation: fastify.auth([requireLoginedHook])
        },
        async (request, reply) => {
            if (!request.account) {
                return reply.status(401).send({ message: "Not Permission Denied" })
            }
            const data = await getBlogEmotionDetail(request.query, request.account)
            reply.send(
                {
                    data,
                    message: "Lấy cảm xúc thành công..."
                }
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
            await deleteBlogEmotion(request.params.id)
            reply.send({
                message: 'Xóa cảm xúc thành công!'
            })
        }
    )

}
