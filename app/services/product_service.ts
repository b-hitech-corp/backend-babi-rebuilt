import Product from '#models/product'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { S3StorageService } from './storage_service.js'
import app from '@adonisjs/core/services/app'
import Image from '#models/image'
import { randomUUID } from 'node:crypto'
import string from '@adonisjs/core/helpers/string'

export default class ProductService {
  private storageService: S3StorageService

  constructor() {
    this.storageService = new S3StorageService()
  }
  /**
   * Create a new product
   */
  async create(data: any, images: MultipartFile[]): Promise<Product> {
    let product: Product
    try {
      // Création du produit
      product = await Product.create(data)
      product.slug = string.slug(product.name)
      await product.related('sizes').attach(data.sizes)
      await product.related('colors').attach(data.colors)
      await product.save()
    } catch (error) {
      throw new Error('Erreur lors de la création du produit : ' + error.message)
    }
    try {
      // Upload des images
      const uploadedImages: Image[] = []
      for (const image of images) {
        const fileName = randomUUID().toString() + Date.now() + '.' + image.extname
        await image.move(app.tmpPath('product_images'), {
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
        uploadedImages.push(newImage)
      }
      await product.related('images').saveMany(uploadedImages)
    } catch (error) {
      // Supprimer le produit en cas d'erreur pour annuler la transaction
      if (product) {
        await product.delete()
      }
      throw new Error(error.message)
    }
    return product
  }

  /**
   * Get all products
   */
  async getAll(page: number, perPage: number): Promise<Product[]> {
    const products = await Product.query()
      .preload('colors')
      .preload('sizes')
      .preload('images', (query) => {
        query.select('id', 'url', 'amazon')
      })
      .paginate(page, perPage)
    return products
  }

  /**
   * Get a specific product by ID
   */
  async getByIdOrSlug(id: number): Promise<Product | null> {
    const product = await Product.query()
      .where('id', id)
      .orWhere('slug', id)
      .preload('colors')
      .preload('sizes')
      .preload('images', (query) => {
        query.select('id', 'url', 'amazon')
      })
      .first()
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

  /**
   * Get the top 100 most ordered products
   */
  async mostOrdered(): Promise<Product[]> {
    const products = await Product.query()
      .withCount('orders', (query) => query.as('orders_count'))
      .orderBy('orders_count', 'desc')
      .limit(100)
      .exec()

    return products
  }

  /**
   * Get the top selling products by summing quantity from all orders
   */
  async topSelling(): Promise<Product[]> {
    const products = await Product.query()
      .withAggregate('orders', (query) => {
        query.sum('quantity').as('quantity_sold')
      })
      .orderBy('quantity_sold', 'desc')
      .limit(100)
      .exec()

    return products
  }
}
