import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Color from './color.js'
import Size from './size.js'
import Image from './image.js'

export default class Product extends BaseModel {
  @hasMany(() => Color)
  declare colors: HasMany<typeof Color>

  @hasMany(() => Size)
  declare sizes: HasMany<typeof Size>

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

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
}
