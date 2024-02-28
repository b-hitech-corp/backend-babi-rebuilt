import Cart from '#models/cart'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

export default class CartsController {
  async addProductToCart({ request, response }: HttpContext) {
    const { productId, quantity, userId } = request.all()
    const user = await User.find(userId)
    if (user) {
      const cart = await Cart.query().where('user_id', user.id).first()
      if (cart) {
        cart.quantity += quantity
        await cart.save()
      } else {
        await Cart.create({ userId: user.id, productId, quantity, sessionId: randomUUID() })
      }
    } else {
      return response.status(404).json({ message: 'Connecte for save cart' })
    }
    return response.json({ message: 'Product added to cart' })
  }
}
