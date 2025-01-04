import { TokenType } from '@/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]

export interface TokenPayload {
  userId: String
  tokenType: TokenTypeValue
  exp: number
  iat: number
}
