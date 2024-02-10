import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('statut')
      table.boolean('isdelivered').defaultTo(false)
      table.float('total_price')
      table.integer('quantity')
      table.string('shipping_address')
      table.string('payment_method')
      table.string('phone_number')
      table.text('notes').nullable()

      table.string('user_id')
      table.foreign('user_id').references('users.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
