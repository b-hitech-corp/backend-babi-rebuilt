import Color from '#models/color'

export default class ColorService {
  /**
   * Get all colors
   * @returns {Promise<Color[]>}
   */
  async getAll(): Promise<Color[]> {
    const colors = await Color.all()
    return colors
  }

  /**
   * Create a new color
   * @param {any} data - The color data
   * @returns {Promise<Color>}
   *
   */
  async create(data: any): Promise<Color> {
    const color = await Color.create(data)
    return color
  }

  /**
   * Find a color by id
   * @param {string} id - The color id
   * @returns {Promise<Color>}
   *
   */
  async find(id: string): Promise<Color | null> {
    const color = await Color.query().where('id', id).preload('products').first()
    return color || null
  }

  /**
   * Update a color by id
   * @param {string} id - The color id
   * @param {any} data - The color data
   * @returns {Promise<Color>}
   *
   */
  async update(id: string, data: any): Promise<Color> {
    const color = await Color.query().where('id', id).firstOrFail()
    color.merge(data)
    await color.save()
    return color
  }

  /**
   * Delete a color by id
   * @param {string} id - The color slug
   * @returns {Promise<{ success: boolean; message?: string }>}
   *
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const color = await Color.query().where('id', id).first()

    if (!color) {
      return { success: false, message: 'Color not found' }
    }

    await color.delete()

    return { success: true }
  }
}
