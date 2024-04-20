import CategoryService from '#services/category_service'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * @index
   * @operationId getCategories
   * @description Returns all categories
   * @responseBody 200 - <Category[]>
   */
  async index({ response }: HttpContext) {
    const categories = await this.categoryService.getAll()
    return response.ok(categories)
  }

  /**
   * @store
   * @operationId createCategory
   * @description Create a new category
   * @requestBody {"name": "string", "description": "string"}
   * @responseBody 201 - <Category>
   */
  async store({ request, response }: HttpContext) {
    const payload = await createCategoryValidator.validate(request.all())
    const category = await this.categoryService.create(payload)
    return response.created(category)
  }

  /**
   * @show
   * @operationId getCategory
   * @description Show individual category by ID
   * @paramPath id - Id of the category
   * @responseBody 200 - <Category>
   */
  async show({ params, response }: HttpContext) {
    const category = await this.categoryService.find(params.id)

    if (!category) {
      return response.notFound({ message: 'Category not found' })
    }

    return response.ok(category)
  }

  /**
   * @update
   * @operationId updateCategory
   * @description Update category by ID
   * @paramPath id - Id of the category
   * @requestBody {"name": "string", "description": "string"}
   * @responseBody 200 - <Category>
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await updateCategoryValidator.validate(request.all())
    const category = await this.categoryService.update(params.id, payload)
    return response.ok(category)
  }

  /**
   * @destroy
   * @operationId deleteCategory
   * @description Delete category by ID
   * @paramPath id - Id of the category
   * @response 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.categoryService.delete(params.id)

    if (!result.success) {
      return response.notFound({ message: result.message })
    }

    return response.noContent()
  }
}
