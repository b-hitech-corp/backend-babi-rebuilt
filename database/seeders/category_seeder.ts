import { CategoryFactory } from '#database/factories/category_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await CategoryFactory.createMany(10)
  }
}
