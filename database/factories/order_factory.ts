import Order from '#models/order'
import Factory from '@adonisjs/lucid/factories'
import { UserFactory } from './user_factory.js'

export const OrderFactory = Factory.define(Order, ({ faker }) => ({
  totalPrice: +faker.commerce.price(),
  quantiy: faker.number.int(),
  shippingAddress: faker.location.city(),
  paymentMethod: faker.lorem.word(),
  phoneNumber: faker.phone.number(),
  notes: faker.lorem.text(),
  user_id: async () => {
    return (await UserFactory.create()).id
  },
})).build()
