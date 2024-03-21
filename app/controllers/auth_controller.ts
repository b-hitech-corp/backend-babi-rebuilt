import UserService from '#services/user_service'
import { loginValidator, registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(private readonly userService: UserService) {}

  async register({ request, response }: HttpContext) {
    const payload = await registerValidator.validate(request.all())
    const user = await this.userService.register(payload)

    return response.created(user)
  }

  async login({ request, response }: HttpContext) {
    const payload = await loginValidator.validate(request.all())
    const user = await this.userService.login(payload)

    return response.ok({ user: user })
  }
}
