// import type { HttpContext } from '@adonisjs/core/http'

import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
  constructor(private readonly userService: UserService) {}

  /**
   * Display a list of users
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 50)
    const users = await this.userService.getAll(page, perPage)
    return response.ok(users)
  }

  /**
   * Display a specific user
   */
  async me({ response, params }: HttpContext) {
    const user = await this.userService.getUser(params.id)
    return response.ok(user)
  }
}
