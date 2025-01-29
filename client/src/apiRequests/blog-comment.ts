import http from '@/lib/http'
import { BlogCommentListResType } from '@/schemaValidations/blog-comment.schema'
import ROUTE_API from "@/constant/route.api"

const blogCommentApiRequest = {
  getList: (params: Object = {}) => http.get<BlogCommentListResType>(ROUTE_API.BLOG_COMMENT, {
    params
  }),
}

export default blogCommentApiRequest
