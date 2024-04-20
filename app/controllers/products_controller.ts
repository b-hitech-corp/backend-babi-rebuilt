import ProductService from '#services/product_service'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProductsController {
  constructor(private readonly productService: ProductService) {}

  /**
   * @index
   * @operationId getProducts
   * @description Returns all products
   * @responseBody 200 - <Product[]>.with(relations).exclude(orders).paginated()
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 50)
    const products = await this.productService.getAll(page, perPage)
    return response.ok(products)
  }

  /**
   * @store
   * @operationId createProduct
   * @description Create a new product
   * @requestFormDataBody {"name":{"type":"string"},"images":{"type":"string","format":"binary"},"price":{"type":"number"},"description":{"type":"string"},"category_id":{"type":"number"}, "stock":{"type":"number"},"sizes":{"type":"array","items":{"type":"number"}},"colors":{"type":"array","items":{"type":"number"}}, "active":{"type":"boolean"}}
   * @responseBody 201 - <Product>.with(relations).exclude(orders)
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
   * @show
   * @operationId getProduct
   * @description Show individual product by ID or slug
   * @paramPath id - Id or slug of the product
   * @responseBody 200 - <Product>.with(relations).exclude(orders)
   * @responseBody 404 - { message: 'Product not found' }
   */
  async show({ params, response }: HttpContext) {
    const product = await this.productService.getByIdOrSlug(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.ok(product)
  }

  /**
   * @update
   * @operationId updateProduct
   * @description Update product by ID
   * @paramPath id - Id of the product
   */
  async update({ params, request }: HttpContext) {
    const payload = await updateProductValidator.validate(request.all())
    return this.productService.update(params.id, payload)
  }

  /**
   * @destroy
   * @operationId deleteProduct
   * @description Delete product by ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.productService.delete(params.id)

    if (!result.success) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.noContent()
  }

  /**
   * @topSelling
   * @operationId topSelling
   * @description Top selling products
   * @responseBody 200 - <Product[]>
   */
  async topSelling({ response }: HttpContext) {
    const products = await this.productService.topSelling()
    return response.ok(products)
  }

  /**
   * @mostOrdered
   * @operationId mostOrdered
   * @description Most ordered products
   * @responseBody 200 - <Product[]>
   */
  async mostOrdered({ response }: HttpContext) {
    const products = await this.productService.mostOrdered()
    return response.ok(products)
  }
}
