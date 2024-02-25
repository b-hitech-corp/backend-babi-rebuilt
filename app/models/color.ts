import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Color extends BaseModel {
  @manyToMany(() => Product)
  declare products: ManyToMany<typeof Product>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare product_id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
