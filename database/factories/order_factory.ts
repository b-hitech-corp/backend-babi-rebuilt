import Order from '#models/order'
import Factory from '@adonisjs/lucid/factories'
import { UserFactory } from './user_factory.js'

export const OrderFactory = Factory.define(Order, ({ faker }) => ({
  total_price: +faker.commerce.price(),
  shipping_address: faker.location.city(),
  payment_method: faker.lorem.word(),
  phone_number: faker.phone.number(),
  notes: faker.lorem.text(),
}))
  .relation('user', () => UserFactory.create())
  .build()
