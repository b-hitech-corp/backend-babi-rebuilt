// import type { HttpContext } from '@adonisjs/core/http'

import OrderService from '#services/order_service'
import { createOrderValidator, updateOrderValidator } from '#validators/order'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { ModelToDto } from '../utils/model_to_dto.js'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  /**
   * @index
   * @operationId getAllOrders
   * @description Get all orders
   * @responseBody 200 - <Order[]>
   */
  async index({}: HttpContext) {
    return this.orderService.getAll()
  }

  /**
   * @store
   * @operationId createOrder
   * @description Create a new order
   * @requestBody <CreateOrderInput>
   * @responseBody 201 - <OrderCreatedOutput>
   * @responseBody 400 - {"message":"Error message"}
   */
  async store({ request, response, auth }: HttpContext) {
    const payload = await createOrderValidator.validate(request.all())
    try {
      const order = await this.orderService.create(payload, auth)
      const orderResponse = ModelToDto.orderCreated(order)
      return response.created(orderResponse)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * @show
   * @operationId getOrder
   * @description Show individual order by ID
   * @paramPath id - Id of the order
   * @responseBody 200 - <Order>
   */
  async show({ params, response }: HttpContext) {
    const order = await this.orderService.getById(params.id)

    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    return order
  }

  /**
   * @update
   * @operationId updateOrder
   * @description Update order by ID
   * @paramPath id - Id of the order
   * @requestBody {"total_price":{"type":"number"},"status":{"type":"string"},"user_id":{"type":"number"},"products":{"type":"array","items":{"type":"object","properties":{"product_id":{"type":"number"},"quantity":{"type":"number"}}}}}
   * @responseBody 200 - <Order>
   */
  async update({ params, request }: HttpContext) {
    const payload = await updateOrderValidator.validate(request.all())
    return this.orderService.update(params.id, payload)
  }

  /**
   * @destroy
   * @operationId deleteOrder
   * @description Delete order by ID
   * @paramPath id - Id of the order
   * @reesponseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.orderService.delete(params.id)
    console.log(result)

    if (!result.success) {
      return response.notFound({ message: 'Order not found' })
    }

    return response.noContent()
  }
}
