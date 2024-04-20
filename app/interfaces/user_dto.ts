import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface UserOutput {
  id: number
  email: string
  first_name: string
  last_name: string
  address?: string
  phone_number?: string
  ip_address?: string
}

export interface CreateUserInput {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface LoginUserInput {
  email: string
  password: string
}

export interface LoginUserOutput {
  user: UserOutput
  token: AccessToken
}

export interface UserListOutput {
  users: ModelPaginatorContract<User>
}
