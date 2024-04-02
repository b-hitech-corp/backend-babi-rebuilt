import UserService from '#services/user_service'
import { loginValidator, registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import UserDTO from '../dtos/user.js'

@inject()
export default class AuthController {
  constructor(private readonly userService: UserService) {}

  async register({ request, response }: HttpContext) {
    const payload = await registerValidator.validate(request.all())
    const user = await this.userService.register(payload)
    const userDTO = new UserDTO(user)

    return response.created(userDTO)
  }

  async login({ request, response }: HttpContext) {
    const payload = await loginValidator.validate(request.all())
    const user = await this.userService.login(payload)

    return response.ok({ user })
  }

  async handleGoogleCallback({ ally, response }: HttpContext) {
    const google = ally.use('google')

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (google.accessDenied()) {
      return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (google.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    /**
     * Google responded with some error
     */
    if (google.hasError()) {
      return google.getError()
    }

    /**
     * Access user info
     */
    const googleUser = await ally.use('google').user()
    try {
      const { user, token } = await this.userService.findOrCreateUser(googleUser)
      return response.ok({ user, token })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
