import User from '#models/user'

class UserListDTO {
  id: number
  email: string
  first_name: string
  last_name: string
  address?: string
  phone_number?: string
  ip_address?: string

  constructor(user: User) {
    this.id = user.id
    this.email = user.email
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.address = user.address!
    this.phone_number = user.phone_number!
    this.ip_address = user.ip_address!
  }
}

export default UserListDTO
