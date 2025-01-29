import http from '@/lib/http'
import { BlogCateListResType } from '@/schemaValidations/blog-category.schema'
import ROUTE_API from "@/constant/route.api"

const blogCategoryApiRequest = {
  getList: (params: Object = {}) => http.get<BlogCateListResType>(ROUTE_API.BLOG_CATE, {
    params
  }),
}

export default blogCategoryApiRequest
