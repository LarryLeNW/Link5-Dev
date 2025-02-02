import PageResponse from '@/@types/page.response'
import ROUTE_API from "@/constant/route.api"
import http from '@/lib/http'
import { BlogCommentResType, BlogCommentSchema, CreateBlogCommentBodyType } from '@/schemaValidations/blog-comment.schema'
import { z } from 'zod'

const blogCommentApiRequest = {
  getList: (params: Object = {}) => http.get<PageResponse<z.infer<typeof BlogCommentSchema>>>(ROUTE_API.BLOG_COMMENT, {
    params
  }),
  create: (body: CreateBlogCommentBodyType) =>
    http.post<BlogCommentResType>(ROUTE_API.BLOG_COMMENT, body),
}

export default blogCommentApiRequest
