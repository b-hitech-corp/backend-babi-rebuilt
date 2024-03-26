import Order from '#models/order'
import Product from '#models/product'
import { inject } from '@adonisjs/core'
import { randomUUID } from 'node:crypto'
import { StripeService } from './stripe_service.js'

@inject()
export default class OrderService {
  constructor(protected stripeService: StripeService) {}

  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    const orders = await Order.all()
    return orders
  }

  /**
   * Get a specific order by ID
   */
  async getById(id: number): Promise<Order | null> {
    const order = await Order.query()
      .where('id', id)
      .preload('user', (query) => {
        query.select(
          'id',
          'first_name',
          'last_name',
          'email',
          'phone_number',
          'address',
          'ip_address'
        )
      })
      .preload('products', (query) => {
        query.pivotColumns(['quantity']).select('id', 'name', 'price')
      })
      .first()
    return order || null
  }

  /**
   * Create a new order
   */
  async create(data: any, auth: any): Promise<Order> {
    data.tracking_number = randomUUID().toString()
    const order = await Order.create(data)
    await auth.user!.related('orders').save(order)
    await Promise.all(
      data.products.map(async (item: any) => {
        const product = await Product.find(item.product_id)
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity
          await product.save()
          await order.related('products').attach({ [item.product_id]: { quantity: item.quantity } })
        } else {
          throw new Error('Product not available or out of stock')
        }
      })
    )

    if (data.payment_method === 'stripe') {
      // Call stripe service to create a checkout session
      try {
        const session = await this.stripeService.createCheckoutSession(data)
        order.stripe_payment_url = session.session.url!
        order.stripe_payment_id = session.session.id!
        order.total_price = session.session.amount_total! / 100
        await order.save()
      } catch (error) {
        throw new Error('Error with stripe payment method, please retry later \n' + error.message)
      }
    }

    return order
  }

  /**
   * Update a order by ID
   */
  async update(id: number, data: any): Promise<Order | null> {
    const order = await Order.find(id)

    if (!order) {
      return null
    }
    if (data.status === 'delivered') {
      data.is_delivered = true
    }
    order.merge(data)
    await order.save()

    return order
  }

  /**
   * Delete a order by ID
   */
  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    const order = await Order.find(id)

    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    await order.delete()

    return { success: true }
  }
}
