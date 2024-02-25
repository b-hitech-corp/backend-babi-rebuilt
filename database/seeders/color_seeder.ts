import Color from '#models/color'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Color.createMany([
      { name: 'Red' },
      { name: 'Blue' },
      { name: 'Green' },
      { name: 'Yellow' },
      { name: 'Black' },
      { name: 'White' },
    ])
  }
}
