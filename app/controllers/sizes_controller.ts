// import type { HttpContext } from '@adonisjs/core/http'

import SizeService from '#services/size_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SizesController {
  constructor(private readonly sizeService: SizeService) {}

  /**
   * @index
   * @operationId getSizes
   * @description Returns all sizes
   * @responseBody 200 - <Size[]>
   */
  async index({ response }: HttpContext) {
    const sizes = await this.sizeService.getAll()
    return response.ok(sizes)
  }

  /**
   * @store
   * @operationId createSize
   * @description Create a new size
   * @requestBody {"name":{"type":"string"}}
   * @responseBody 201 - <Size>
   */
  async store({ request, response }: HttpContext) {
    const size = await this.sizeService.create(request.all())
    return response.created(size)
  }

  /**
   * @show
   * @operationId getSize
   * @description Show individual size by ID
   * @paramPath id - Id of the size
   * @responseBody 200 - <Size>
   */
  async show({ params, response }: HttpContext) {
    const size = await this.sizeService.find(params.id)

    if (!size) {
      return response.notFound({ message: 'Size not found' })
    }

    return response.ok(size)
  }

  /**
   * @update
   * @operationId updateSize
   * @description Update size by ID
   * @paramPath id - Id of the size
   * @requestBody {"name":{"type":"string"}}
   * @responseBody 200 - <Size>
   */
  async update({ params, request, response }: HttpContext) {
    const size = await this.sizeService.update(params.id, request.all())

    if (!size) {
      return response.notFound({ message: 'Size not found' })
    }

    return response.ok(size)
  }

  /**
   * @destroy
   * @operationId deleteSize
   * @description Delete size by ID
   * @paramPath id - Id of the size
   */
  async destroy({ params, response }: HttpContext) {
    const size = await this.sizeService.delete(params.id)

    if (!size) {
      return response.notFound({ message: 'Size not found' })
    }

    return response.noContent()
  }
}
