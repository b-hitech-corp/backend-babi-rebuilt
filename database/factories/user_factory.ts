import User from '#models/user'
import Factory from '@adonisjs/lucid/factories'
import hash from '@adonisjs/core/services/hash'

export const UserFactory = Factory.define(User, async ({ faker }) => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    ip_address: faker.internet.ip(),
    address: faker.location.city(),
    phone_number: faker.phone.number(),
    password: await hash.make(faker.internet.password()),
  }
}).build()
