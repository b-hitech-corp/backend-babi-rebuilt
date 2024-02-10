import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Order extends BaseModel {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Product)
  declare products: ManyToMany<typeof Product>

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
