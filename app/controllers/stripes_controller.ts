import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import Stripe from 'stripe'

export default class StripesController {
  async createCheckoutSession({ request, response }: HttpContext) {
    if (!process.env.STRIPE_SECRET_KEY) {
      return response.badRequest({ message: 'Error, please try again' })
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const cartItems = request.input('cartItems')
    const lineItemsPromises = cartItems.map(async (item: any) => {
      const product = await Product.query().where('id', item.productId).preload('images').first()
      if (!product) {
        return response.badRequest({ message: 'Product in cart not found, please retry !' })
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.images[0]!.url],
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      }
    })
    const lineItems = await Promise.all(lineItemsPromises)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    })

    return response.ok({ url: session.url })
  }
}
