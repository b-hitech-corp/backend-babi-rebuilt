import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enum('status', ['pending', 'processing', 'shipped', 'delivered', 'canceled'])
        .notNullable()
        .defaultTo('pending')
      table.boolean('is_delivered').defaultTo(false)
      table.decimal('total_price')
      table.string('shipping_address')
      table.string('payment_method')
      table.string('phone_number')
      table.text('notes').nullable()

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
