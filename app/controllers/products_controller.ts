import ProductService from '#services/product_service'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProductsController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Display a list of products
   */
  async index({ response }: HttpContext) {
    return response.ok(this.productService.getAll())
  }

  /**
   * Store a new product
   */
  async store({ request, response }: HttpContext) {
    const payload = await createProductValidator.validate(request.all())
    return response.created(this.productService.create(payload))
  }

  /**
   * Show individual product
   */
  async show({ params, response }: HttpContext) {
    const product = await this.productService.getById(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.ok(product)
  }

  /**
   * Update product
   */
  async update({ params, request }: HttpContext) {
    const payload = await updateProductValidator.validate(request.all())
    return this.productService.update(params.id, payload)
  }

  /**
   * Delete product
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.productService.delete(params.id)

    if (!result.success) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.noContent()
  }
}
