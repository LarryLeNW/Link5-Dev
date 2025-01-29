import http from '@/lib/http'
import { BlogListResType, BlogResType, CreateBlogBodyType } from '@/schemaValidations/blog.schema'
import ROUTE_API from "@/constant/route.api"

const blogApiRequest = {
  getList: (params: Object) => http.get<BlogListResType>(ROUTE_API.BLOG, {
    params
  }),
  getDetail: (id: string) => http.get<BlogResType>(`${ROUTE_API.BLOG}/${id}`),
  create: (body: CreateBlogBodyType) =>
    http.post<BlogResType>(ROUTE_API.BLOG, body),
}

export default blogApiRequest
