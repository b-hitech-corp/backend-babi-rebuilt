import Order from '#models/order'
import Product from '#models/product'
import { randomUUID } from 'crypto'

export default class OrderService {
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
  async create(data: any): Promise<Order> {
    const order = await Order.create(data)
    order.tracking_number = randomUUID().toString()
    await order.save()
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
