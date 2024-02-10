import { ProductFactory } from '#database/factories/product_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await ProductFactory.createMany(10)
      .then((data) => {})
      .catch((e) => {
        console.log(e)
      })
  }
}
