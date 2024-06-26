import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Color from './color.js'
import Size from './size.js'
import Image from './image.js'
import Order from './order.js'
import Category from './category.js'

export default class Product extends BaseModel {
  @manyToMany(() => Order, {
    pivotTable: 'order_product',
    pivotColumns: ['quantity'],
  })
  declare orders: ManyToMany<typeof Order>

  @manyToMany(() => Size)
  declare sizes: ManyToMany<typeof Size>

  @manyToMany(() => Color)
  declare colors: ManyToMany<typeof Color>

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @column()
  declare categoryId: number

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare stock: number

  @column()
  declare active: boolean

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  serializeExtras() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      quantity: this.$extras.pivot_quantity, // Inclure les données pivot
    }
  }
}
