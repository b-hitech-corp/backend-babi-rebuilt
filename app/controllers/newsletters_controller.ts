import NewsletterSubscriber from '#models/newsletter_subscriber'
import { createNewsletterSubscriberValidator } from '#validators/newsletter'
import { HttpContext } from '@adonisjs/core/http'

export default class NewslettersController {
  /**
   * @addEmail
   * @operationId addEmail
   * @description Add email to newsletter list
   * @requestBody {"email":"string"}
   * @responseBody 201 - Email added to the newsletter list
   **/
  async addEmail({ request, response }: HttpContext) {
    const payload = await createNewsletterSubscriberValidator.validate(request.all())
    try {
      await NewsletterSubscriber.create(payload)
    } catch (error) {
      return response.badRequest({ message: 'Email already subscribed', code: response.status })
    }
    return response.created({ message: 'Email added to the newsletter list' })
  }

  /**
   * @removeEmail
   * @operationId removeEmail
   * @description Remove email from newsletter list
   * @pathParam email - Email to remove
   * @responseBody 204 - Email removed from the newsletter list
   * @responseBody 404 - Subscriber not found
   **/
  async removeEmail({ params, response }: HttpContext) {
    const email = params.email as string
    const subscriber = await NewsletterSubscriber.findBy('email', email)

    if (!subscriber) {
      return response.notFound({ message: 'Subscriber not found' })
    }

    await subscriber.delete()
    return response.noContent()
  }

  /**
   * @listEmails
   * @operationId listEmails
   * @description List all emails subscribed to the newsletter
   * @responseBody 200 - <NewsletterSubscriber[]>
   **/
  async listEmails({ response }: HttpContext) {
    const subscribers = await NewsletterSubscriber.all()

    return response.ok(subscribers)
  }
}
