import { LoginUserOutput, UserOutput } from '../interfaces/user_dto.js'
import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import Order from '#models/order'
import { OrderCreatedOutput } from '../interfaces/order_dto.js'

export class ModelToDto {
  static user(user: User): UserOutput {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address!,
      phone_number: user.phone_number!,
      ip_address: user.ip_address!,
    }
  }

  static userLogin(user: User, token: AccessToken): LoginUserOutput {
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address!,
        phone_number: user.phone_number!,
        ip_address: user.ip_address!,
      },
      token: token,
    }
  }

  static orderCreated(order: Order): OrderCreatedOutput {
    return {
      id: order.id,
      total_price: order.total_price,
      shipping_address: order.shipping_address,
      payment_method: order.payment_method,
      phone_number: order.phone_number,
      stripe_payment_url: order.stripe_payment_url,
      tracking_number: order.tracking_number,
      status: order.status,
      is_delivered: order.is_delivered,
      user_id: order.userId,
    }
  }
}
