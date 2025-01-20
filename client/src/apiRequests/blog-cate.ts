import http from '@/lib/http'
import { BlogCateListResType } from '@/schemaValidations/blog-category.schema'

const blogCategoryApiRequest = {
  getList: (params: Object = {}) => http.get<BlogCateListResType>('/blog-category', {
    params
  }),
}

export default blogCategoryApiRequest
