import ROUTE_API from "@/constant/route.api"
import http from '@/lib/http'
import { BlogEmotionResType, CreateBlogEmotionBodyType } from '@/schemaValidations/blog-emotion.schema'

const blogEmotionApiRequest = {
  create: (body: CreateBlogEmotionBodyType) =>
    http.post<BlogEmotionResType>(ROUTE_API.BLOG_EMOTION, body),
}

export default blogEmotionApiRequest
