// import type { HttpContext } from '@adonisjs/core/http'

import UserService from '#services/user_service'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  constructor(private readonly userService: UserService) {}

  /**
   * Display a list of users
   */
  async index({ response }: HttpContext) {
    const users = await this.userService.getAll()
    return response.ok(users)
  }

  /**
   * Store a new user
   */
  async store({ request, response }: HttpContext) {
    const payload = request.all()
    const result = await this.userService.create(payload)
    return response.created(result)
  }

  /**
   * Show individual user
   */
  async show({ params, response }: HttpContext) {
    const user = await this.userService.getById(params.id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    return response.ok(user)
  }

  /**
   * Update user
   */
  async update({ params, request }: HttpContext) {
    const payload = request.all()
    return this.userService.update(params.id, payload)
  }

  /**
   * Delete user
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.userService.delete(params.id)
    return response.ok(result)
  }
}
