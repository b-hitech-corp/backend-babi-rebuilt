import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Order from './order.js'
import Cart from './cart.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @hasOne(() => Cart)
  declare cart: HasOne<typeof Cart>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string

  @column()
  declare last_name: string

  @column()
  declare address: string | null

  @column()
  declare phone_number: string | null

  @column()
  declare ip_address: string | null

  @column()
  declare email: string

  @column()
  declare password: string | null

  @column()
  declare google_id: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
