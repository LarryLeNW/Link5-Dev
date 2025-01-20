import http from '@/lib/http'
import { BlogListResType, BlogResType, CreateBlogBodyType } from '@/schemaValidations/blog.schema'

const blogApiRequest = {
  getList: (params: Object) => http.get<BlogListResType>('/blog', {
    params
  }),
  getDetail: (id: string) => http.get<BlogResType>(`/blog/${id}`),
  create: (body: CreateBlogBodyType) =>
    http.post<BlogResType>('/blog', body),
}

export default blogApiRequest
