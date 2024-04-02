import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import UserDTO from '../dtos/user.js'

export default class UserService {
  async getAll(page: number, perPage: number): Promise<User[]> {
    const users = await User.query().paginate(page, perPage)
    return users
  }

  async register(data: any): Promise<User> {
    const payload = await registerValidator.validate(data)
    const user = await User.create(payload)
    return user
  }

  async login(data: any): Promise<{ user: UserDTO; token: AccessToken }> {
    const payload = await loginValidator.validate(data)
    const { email, password } = payload
    const user = await User.verifyCredentials(email, password)
    const userDTO = new UserDTO(user)
    const token = await User.accessTokens.create(user)
    return { user: userDTO, token }
  }

  async getAllUsers(): Promise<User[]> {
    const users = await User.all()
    return users
  }

  async getUser(id: number): Promise<UserDTO> {
    const user = await User.query().where('id', id).preload('orders').firstOrFail()
    return new UserDTO(user)
  }

  async findOrCreateUser(googleUser: any): Promise<{ user: UserDTO; token: AccessToken }> {
    let user = await User.findBy('google_id', googleUser.id)

    if (user) {
      const token = await User.accessTokens.create(user)
      return { user: new UserDTO(user), token }
    }

    try {
      const fullName = googleUser.name || 'Unknown'
      const [firstName, lastName] = fullName.split(' ')

      user = await User.create({
        email: googleUser.email,
        first_name: firstName,
        last_name: lastName,
        password: '',
        google_id: googleUser.id,
      })
      const token = await User.accessTokens.create(user)
      return { user: new UserDTO(user), token }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
