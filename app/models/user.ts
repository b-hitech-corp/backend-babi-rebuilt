import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Order from './order.js'
import Cart from './cart.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @hasOne(() => Cart)
  declare cart: HasOne<typeof Cart>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string | null

  @column()
  declare last_name: string | null

  @column()
  declare address: string

  @column()
  declare phone_number: string

  @column()
  declare ip_address: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
