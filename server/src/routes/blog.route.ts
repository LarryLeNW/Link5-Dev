import { createBlog, getBlogList } from '@/controllers/blog.controller';
import { requireLoginedHook } from '@/hooks/auth.hooks';
import { CreateBlogBody, CreateBlogBodyType, BlogRes, BlogListRes, BlogResType, BlogListResType } from '@/schemaValidations/blog.schema';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function blogRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{
    Body: CreateBlogBodyType;
    Reply: BlogResType;
  }>(
    '/',
    {
      schema: {
        body: CreateBlogBody,
        response: {
          200: BlogRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const blog = await createBlog(request.body);
      reply.send({
        data: blog,
        message: 'Tạo blog thành công!'
      });
    }
  );

  fastify.get<{
    Reply: BlogListResType;
  }>(
    '/',
    {
      schema: {
        response: {
          200: BlogListRes
        }
      }
    },
    async (request, reply) => {
      const blogs = await getBlogList();
      reply.send({
        data: blogs,
        message: 'Lấy danh sách blogs thành công!'
      });
    }
  );
}
