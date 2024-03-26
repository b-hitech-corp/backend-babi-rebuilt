// import type { HttpContext } from '@adonisjs/core/http'

import OrderService from '#services/order_service'
import { createOrderValidator, updateOrderValidator } from '#validators/order'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  /**
   * Display a list of orders
   */
  async index({}: HttpContext) {
    return this.orderService.getAll()
  }

  /**
   * Store a new order
   */
  async store({ request, response, auth }: HttpContext) {
    const payload = await createOrderValidator.validate(request.all())
    try {
      const $order = await this.orderService.create(payload, auth)
      return response.created($order)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Show individual order
   */
  async show({ params, response }: HttpContext) {
    const order = await this.orderService.getById(params.id)
    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    return order
  }

  /**
   * Update order
   */
  async update({ params, request }: HttpContext) {
    const payload = await updateOrderValidator.validate(request.all())
    return this.orderService.update(params.id, payload)
  }

  /**
   * Delete order
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.orderService.delete(params.id)
    console.log(result)

    if (!result.success) {
      return response.notFound({ message: 'Order not found' })
    }

    return response.noContent()
  }

  async stripeWebhook({ request, response }: HttpContext) {
    console.log('Stripe webhook called')
    console.log(request.all())
    return response.noContent()
  }
}
