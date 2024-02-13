import Product from '#models/product'

export default class ProductService {
  /**
   * Create a new product
   */
  async create(data: any): Promise<Product> {
    const product = await Product.create(data)
    return product
  }

  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    const products = await Product.query().paginate(1, 30)
    return products
  }

  /**
   * Get a specific product by ID
   */
  async getById(id: number): Promise<Product | null> {
    const product = await Product.find(id)
    return product || null
  }

  /**
   * Update a product by ID
   */
  async update(id: number, data: any): Promise<Product | null> {
    const product = await Product.find(id)

    if (!product) {
      return null
    }

    product.merge(data)
    await product.save()

    return product
  }

  /**
   * Delete a product by ID
   */
  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    const product = await Product.find(id)

    if (!product) {
      return { success: false, message: 'Product not found' }
    }

    await product.delete()

    return { success: true }
  }
}
