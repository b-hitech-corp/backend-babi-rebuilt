import Product from '#models/product'
import Factory from '@adonisjs/lucid/factories'

export const ProductFactory = Factory.define(Product, ({ faker }) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  stock: faker.number.int(),
  active: faker.datatype.boolean(),
  price: +faker.commerce.price(),
})).build()
