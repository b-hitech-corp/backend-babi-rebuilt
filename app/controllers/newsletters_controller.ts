import NewsletterSubscriber from '#models/newsletter_subscriber'
import { createNewsletterSubscriberValidator } from '#validators/newsletter'
import { HttpContext } from '@adonisjs/core/http'

export default class NewslettersController {
  async addEmail({ request, response }: HttpContext) {
    const payload = await createNewsletterSubscriberValidator.validate(request.all())
    try {
      await NewsletterSubscriber.create(payload)
    } catch (error) {
      return response.badRequest({ message: 'Email already subscribed', code: response.status })
    }
    return response.status(201).json({ message: 'Email added to the newsletter list' })
  }

  async removeEmail({ params, response }: HttpContext) {
    const email = params.email as string
    const subscriber = await NewsletterSubscriber.findBy('email', email)

    if (!subscriber) {
      return response.notFound({ message: 'Subscriber not found' })
    }

    await subscriber.delete()
    return response.noContent()
  }

  async listEmails({ response }: HttpContext) {
    const subscribers = await NewsletterSubscriber.all()

    return response.ok(subscribers)
  }
}
