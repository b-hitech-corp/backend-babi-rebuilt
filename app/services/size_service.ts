import Size from '#models/size'
import string from '@adonisjs/core/helpers/string'

export default class SizeService {
  /**
   * Get all sizes
   * @returns {Promise<Size[]>}
   */
  async getAll(): Promise<Size[]> {
    const sizes = await Size.all()
    return sizes
  }

  /**
   * Create a new size
   * @param {any} data - The size data
   * @returns {Promise<Size>}
   *
   */
  async create(data: any): Promise<Size> {
    const size = await Size.create(data)
    return size
  }

  /**
   * Find a size by id
   * @param {string} id - The size id
   * @returns {Promise<Size>}
   *
   */
  async find(id: string): Promise<Size | null> {
    const size = await Size.query().where('id', id).preload('products').first()
    return size || null
  }

  /**
   * Update a size by id
   * @param {string} id - The size id
   * @param {any} data - The size data
   * @returns {Promise<Size>}
   *
   */
  async update(id: string, data: any): Promise<Size> {
    const size = await Size.query().where('id', id).firstOrFail()
    size.merge(data)
    await size.save()
    return size
  }

  /**
   * Delete a size by id
   * @param {string} id - The size slug
   * @returns {Promise<{ success: boolean; message?: string }>}
   *
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const size = await Size.query().where('id', id).first()

    if (!size) {
      return { success: false, message: 'Size not found' }
    }

    await size.delete()

    return { success: true }
  }
}
