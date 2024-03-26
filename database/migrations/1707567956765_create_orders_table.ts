import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('tracking_number').nullable().unique()
      table
        .enum('status', ['pending', 'canceled', 'paid', 'unpaid'])
        .notNullable()
        .defaultTo('pending')
      table.boolean('is_delivered').defaultTo(false)
      table.decimal('total_price')
      table.string('shipping_address')
      table.string('payment_method')
      table.string('phone_number')
      table.text('notes').nullable()
      table.string('stripe_payment_url').nullable()
      table.string('stripe_payment_id').nullable()

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
    this.schema.dropTable(this.tableName)
  }
}
