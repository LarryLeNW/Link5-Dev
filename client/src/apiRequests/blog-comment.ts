import http from '@/lib/http'
import { BlogCommentListResType, BlogCommentResType, CreateBlogCommentBodyType } from '@/schemaValidations/blog-comment.schema'
import ROUTE_API from "@/constant/route.api"

const blogCommentApiRequest = {
  getList: (params: Object = {}) => http.get<BlogCommentListResType>(ROUTE_API.BLOG_COMMENT, {
    params
  }),
  create: (body: CreateBlogCommentBodyType) =>
    http.post<BlogCommentResType>(ROUTE_API.BLOG_COMMENT, body),
}

export default blogCommentApiRequest
