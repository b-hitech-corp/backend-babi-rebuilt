import { OrderFactory } from '#database/factories/order_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await OrderFactory.with('user', 10).create()
  }
}
