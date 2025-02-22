import ROUTE_API from "@/constant/route.api"
import http from '@/lib/http'
import { BlogEmotionResType, CreateBlogEmotionBodyType } from '@/schemaValidations/blog-emotion.schema'
import { MessageResType } from "@/schemaValidations/common.schema"

const blogEmotionApiRequest = {
  create: (body: CreateBlogEmotionBodyType) =>
    http.post<BlogEmotionResType>(ROUTE_API.BLOG_EMOTION, body),
  getSelected: (params: Object = {}) => http.get<BlogEmotionResType>(`${ROUTE_API.BLOG_EMOTION}/selected`, { params }),
  delete: (id: string) => http.delete<MessageResType>(`${ROUTE_API.BLOG_EMOTION}/${id}`)
}

export default blogEmotionApiRequest
