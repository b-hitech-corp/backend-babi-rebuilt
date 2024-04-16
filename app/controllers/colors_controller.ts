// import type { HttpContext } from '@adonisjs/core/http'

import ColorService from '#services/color_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ColorsController {
  constructor(private readonly colorService: ColorService) {}

  /**
   * @index
   * @operationId getColors
   * @description Returns all colors
   * @responseBody 200 - <Color[]>
   */
  async index({ response }: HttpContext) {
    const colors = await this.colorService.getAll()
    return response.ok(colors)
  }

  /**
   * @store
   * @operationId createColor
   * @description Create a new color
   * @requestBody {"name":{"type":"string"}}
   * @responseBody 201 - <Color>
   */
  async store({ request, response }: HttpContext) {
    const color = await this.colorService.create(request.all())
    return response.created(color)
  }

  /**
   * @show
   * @operationId getSize
   * @description Show individual color by ID
   * @paramPath id - Id of the color
   * @responseBody 200 - <Color>
   */
  async show({ params, response }: HttpContext) {
    const color = await this.colorService.find(params.id)

    if (!color) {
      return response.notFound({ message: 'Color not found' })
    }

    return response.ok(color)
  }

  /**
   * @update
   * @operationId updateSize
   * @description Update color by ID
   * @paramPath id - Id of the color
   * @requestBody {"name":{"type":"string"}}
   * @responseBody 200 - <Color>
   */
  async update({ params, request, response }: HttpContext) {
    const color = await this.colorService.update(params.id, request.all())

    if (!color) {
      return response.notFound({ message: 'Color not found' })
    }

    return response.ok(color)
  }

  /**
   * @destroy
   * @operationId deleteSize
   * @description Delete color by ID
   * @paramPath id - Id of the color
   */
  async destroy({ params, response }: HttpContext) {
    const color = await this.colorService.delete(params.id)

    if (!color) {
      return response.notFound({ message: 'Color not found' })
    }

    return response.noContent()
  }
}
