import CategoryService from '#services/category_service'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Display a list of categories
   */
  async index({ response }: HttpContext) {
    const categories = await this.categoryService.getAll()
    return response.ok(categories)
  }

  /**
   * Store a new category
   */
  async store({ request, response }: HttpContext) {
    const payload = await createCategoryValidator.validate(request.all())
    const category = await this.categoryService.create(payload)
    return response.created(category)
  }

  /**
   * Show individual category by ID
   */
  async show({ params, response }: HttpContext) {
    const category = await this.categoryService.find(params.id)

    if (!category) {
      return response.notFound({ message: 'Category not found' })
    }

    return response.ok(category)
  }

  /**
   * Update category
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await updateCategoryValidator.validate(request.all())
    const category = await this.categoryService.update(params.id, payload)
    return response.ok(category)
  }

  /**
   * Delete category
   */
  async destroy({ params, response }: HttpContext) {
    const result = await this.categoryService.delete(params.id)

    if (!result.success) {
      return response.notFound({ message: result.message })
    }

    return response.noContent()
  }
}
