import Product from '#models/product'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { S3StorageService } from './storage_service.js'
import app from '@adonisjs/core/services/app'
import Image from '#models/image'
import { randomUUID } from 'node:crypto'

export default class ProductService {
  private storageService: S3StorageService

  constructor() {
    this.storageService = new S3StorageService()
  }
  /**
   * Create a new product
   */
  async create(data: any, images: MultipartFile[]): Promise<Product> {
    const product = await Product.create(data)
    await product.related('sizes').attach(data.sizes)
    await product.related('colors').attach(data.colors)

    // Upload images to S3
    for (const image of images) {
      const fileName = randomUUID().toString() + Date.now() + '.' + image.extname
      await image!.move(app.tmpPath('product_images'), {
        name: fileName,
      })
      const url = await this.storageService.uploadFile(
        fileName,
        app.tmpPath('product_images', fileName)
      )
      const newImage = await Image.create({
        url: fileName,
        amazon: url!,
      })
      await product.related('images').save(newImage)
    }

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
    const product = await Product.query().where('id', id).preload('colors').preload('sizes').first()
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
