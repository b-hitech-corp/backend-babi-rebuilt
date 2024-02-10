import User from '#models/user'
import Factory from '@adonisjs/lucid/factories'
import hash from '@adonisjs/core/services/hash'

export const UserFactory = Factory.define(User, async ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    ipAddress: faker.internet.ip(),
    address: faker.location.city(),
    phoneNumber: faker.phone.number(),
    password: await hash.make(faker.internet.password()),
  }
}).build()
