import envConfig, { API_URL } from '@/config'
import path from 'path'

import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'

import { errorHandlerPlugin } from '@/plugins/errorHandler.plugins'
import validatorCompilerPlugin from '@/plugins/validatorCompiler.plugins'
import socketIOPlugin from '@/plugins/socketIO.plugin'

import { createFolder } from '@/utils/helpers'
import { handleSeedData } from '@/seed/main'
import * as routes from '@/routes'

const fastify = Fastify({ logger: true })

const registerPlugins = (app: FastifyInstance) => {
  app.register(cors, { origin: ['*'], credentials: true })
  app.register(fastifyAuth, { defaultRelation: 'and' })
  app.register(fastifyHelmet, {
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
  app.register(fastifyCookie)
  app.register(validatorCompilerPlugin)
  app.register(errorHandlerPlugin)
  app.register(socketIOPlugin)
}

const registerRoutes = (app: FastifyInstance) => {
  fastify.get('/seed', async () => await handleSeedData())

  const routeDefinitions = [
    { route: routes.authRoutes, prefix: '/auth' },
    { route: routes.accountRoutes, prefix: '/account' },
    { route: routes.mediaRoutes, prefix: '/media' },
    { route: routes.staticRoutes, prefix: '/static' },
    { route: routes.productRoutes, prefix: '/products' },
    { route: routes.blogCateRoutes, prefix: '/blog-category' },
    { route: routes.blogRoutes, prefix: '/blog' },
    { route: routes.blogCommentRoutes, prefix: '/blog-comment' },
    { route: routes.blogEmotionRoutes, prefix: '/blog-emotion' },
    { route: routes.testRoutes, prefix: '/test' },
  ]

  routeDefinitions.forEach(({ route, prefix }) => app.register(route, { prefix }))

}

const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER))

    registerPlugins(fastify)
    registerRoutes(fastify)


    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.IS_PRODUCTION ? '0.0.0.0' : 'localhost'
    })

    console.log(`Server đang chạy dưới local tại: ${API_URL}`)
    if (envConfig.IS_PRODUCTION) {
      console.log(`Đang ở mode production với domain: ${envConfig.PRODUCTION_URL}`)
    }
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
