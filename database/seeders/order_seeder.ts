import { OrderFactory } from '#database/factories/order_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await OrderFactory.createMany(10)
      .then((data) => {})
      .catch((e) => {
        console.log(e)
      })
  }
}
