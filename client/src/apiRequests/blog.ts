import http from '@/lib/http'
import { BlogListResType, BlogResType } from '@/schemaValidations/blog.schema'

const blogApiRequest = {
  getList: (params: Object) => http.get<BlogListResType>('/blog', {
    params
  }),
  getDetail: (id: string) => http.get<BlogResType>(`/blog/${id}`),
}

export default blogApiRequest
