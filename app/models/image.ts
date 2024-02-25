import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Image extends BaseModel {
  @belongsTo(() => Product)
  declare products: BelongsTo<typeof Product>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare url: string

  @column()
  declare amazon: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
