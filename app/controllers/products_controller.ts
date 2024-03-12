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
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 50)
    const products = await this.productService.getAll(page, perPage)
    return response.ok(products)
  }

  /**
   * Store a new product
   */
  async store({ request, response }: HttpContext) {
    const images = request.files('images', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })
    if (!images || !images.length) {
      return response.badRequest({ message: 'Image is required' })
    }

    const payload = await createProductValidator.validate(request.all())
    try {
      const product = await this.productService.create(payload, images)
      return response.created(product)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Show individual product by ID
   */
  async show({ params, response }: HttpContext) {
    const product = await this.productService.getByIdOrSlug(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found ID' })
    }

    return response.ok(product)
  }

  /**
   * Show individual product by slug
   */
  async getBySlug({ params, response }: HttpContext) {
    const product = await this.productService.getBySlug(params.slug)

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

  /**
   * Top selling products
   */
  async topSelling({ response }: HttpContext) {
    const products = await this.productService.topSelling()
    return response.ok(products)
  }

  /**
   * Most ordered products
   */
  async mostOrdered({ response }: HttpContext) {
    const products = await this.productService.mostOrdered()
    return response.ok(products)
  }
}
