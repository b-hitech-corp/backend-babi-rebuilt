import User from '#models/user'
import { registerValidator } from '#validators/auth'
import UserDTO from '../dtos/user.js'
import { ModelToDto } from '../utils/model_to_dto.js'
import { CreateUserInput, LoginUserInput, LoginUserOutput } from '../interfaces/user_dto.js'

export default class UserService {
  /**
   * Register a new user
   * @param data CreateUserInput Informations to create a new user
   * @returns User
   */
  async register(data: CreateUserInput): Promise<User> {
    const payload = await registerValidator.validate(data)
    const user = await User.create(payload)
    return user
  }

  /**
   * Login user with email and password
   * @param data LoginUserInput (email, password)
   * @returns LoginUserOutput
   */
  async login(data: LoginUserInput): Promise<LoginUserOutput> {
    const { email, password } = data
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    const loginOutput: LoginUserOutput = ModelToDto.userLogin(user, token)
    return loginOutput
  }

  /**
   * Login user with google
   * @param googleUser
   * @returns LoginUserOutput
   */
  async googleLogin(googleUser: any): Promise<LoginUserOutput> {
    let user = await User.findBy('google_id', googleUser.id)

    if (user) {
      const token = await User.accessTokens.create(user)
      const loginOutput: LoginUserOutput = ModelToDto.userLogin(user, token)
      return loginOutput
    }

    try {
      const fullName = googleUser.name || 'Unknown'
      const [firstName, lastName] = fullName.split(' ')
      user = await User.create({
        email: googleUser.email,
        first_name: firstName,
        last_name: lastName,
        google_id: googleUser.id,
      })
      const token = await User.accessTokens.create(user)
      const loginOutput: LoginUserOutput = ModelToDto.userLogin(user, token)
      return loginOutput
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get all users
   * @returns User[]
   */
  async getAll(page: number, perPage: number): Promise<User[]> {
    const users = await User.query().paginate(page, perPage)
    return users
  }

  /**
   * Get user by id
   * @param id
   * @returns UserDTO
   */
  async getUser(id: number): Promise<UserDTO> {
    const user = await User.query().where('id', id).preload('orders').firstOrFail()
    return new UserDTO(user)
  }

  /**
   * Delete user by id
   * @param id
   */
  async deleteUser(id: number): Promise<void> {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
