import Category from '#models/category'
import string from '@adonisjs/core/helpers/string'

export default class CategoryService {
  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   *
   */
  async getAll(): Promise<Category[]> {
    const categories = await Category.all()
    return categories
  }

  /**
   * Create a new category
   * @param {any} data - The category data
   * @returns {Promise<Category>}
   *
   */
  async create(data: any): Promise<Category> {
    const category = await Category.create(data)
    category.slug = string.slug(category.name)
    await category.save()
    return category
  }

  /**
   * Find a category by slug
   * @param {string} slug - The category slug
   * @returns {Promise<Category>}
   *
   */
  async find(id: string): Promise<Category | null> {
    const category = await Category.query().where('id', id).preload('products').first()
    return category || null
  }

  /**
   * Update a category by slug
   * @param {string} slug - The category slug
   * @param {any} data - The category data
   * @returns {Promise<Category>}
   *
   */
  async update(id: string, data: any): Promise<Category> {
    const category = await Category.query().where('id', id).firstOrFail()
    category.merge(data)
    await category.save()
    return category
  }

  /**
   * Delete a category by slug
   * @param {string} slug - The category slug
   * @returns {Promise<{ success: boolean; message?: string }>}
   *
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const category = await Category.query().where('id', id).first()

    if (!category) {
      return { success: false, message: 'Category not found' }
    }

    await category.delete()

    return { success: true }
  }
}
