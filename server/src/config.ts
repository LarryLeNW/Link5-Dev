import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

config({
  path: '.env'
})

const checkEnv = async () => {
  const chalk = (await import('chalk')).default
  if (!fs.existsSync(path.resolve('.env'))) {
    console.log(chalk.red(`Không tìm thấy file môi trường .env`))
    process.exit(1)
  }
}
checkEnv()

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  SESSION_TOKEN_SECRET: z.string(),
  SESSION_TOKEN_EXPIRES_IN: z.string(),
  DOMAIN: z.string(),
  PROTOCOL: z.string(),
  UPLOAD_FOLDER: z.string(),
  COOKIE_MODE: z.enum(['true', 'false']).transform((val) => val === 'true'),
  IS_PRODUCTION: z.enum(['true', 'false']).transform((val) => val === 'true'),
  PRODUCTION_URL: z.string(),
  IK_URL_ENDPOINT: z.string(),
  IK_PUBLIC_KEY: z.string(),
  IK_PRIVATE_KEY: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_EMAIL: z.string().email(),
  SMTP_PASSWORD: z.string(),
  FRONTEND_URL: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}
const envConfig = configServer.data
export const API_URL = envConfig.IS_PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> { }
  }
}
