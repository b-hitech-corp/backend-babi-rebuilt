import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_product'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('product_id')
      table.string('order_id')

      table.foreign('product_id').references('product.id')
      table.foreign('order_id').references('order.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
