import http from '@/lib/http'
import { BlogListResType, BlogResType } from '@/schemaValidations/blog.schema'

const blogApiRequest = {
  getList: () => http.get<BlogListResType>('/blog'),
  getDetail: (id: string) => http.get<BlogResType>(`/blog/${id}`),
}

export default blogApiRequest
