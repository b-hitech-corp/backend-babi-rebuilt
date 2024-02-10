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

  @column()
  declare userId: number

  @column()
  declare statut: string

  @column()
  declare total_price: number

  @column()
  declare quantity: number

  @column()
  declare shipping_address: string

  @column()
  declare payment_method: string

  @column()
  declare phone_number: string

  @column()
  declare notes: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
