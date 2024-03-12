import User from '#models/user'

export default class UserService {
  async getAll(): Promise<User[]> {
    const users = await User.query().paginate(1, 30)
    return users
  }

  async getById(id: number): Promise<User | null> {
    const user = await User.query().where('id', id).first()
    return user || null
  }

  async register(data: any): Promise<User> {
    const user = await User.create(data)
    return user
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await User.query().where('email', email).first()

    if (!user) {
      return null
    }

    if (user.password !== password) {
      return null
    }

    return user
  }

  async update(id: number, data: any): Promise<User | null> {
    const user = await User.find(id)

    if (!user) {
      return null
    }

    user.merge(data)
    await user.save()

    return user
  }

  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    const user = await User.find(id)

    if (!user) {
      return { success: false, message: 'User not found' }
    }

    await user.delete()

    return { success: true }
  }
}
