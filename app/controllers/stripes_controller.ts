import { StripeService } from '#services/stripe_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class StripesController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Handle stripe webhook
   */
  async webhook({ request, response }: HttpContext) {
    this.stripeService.handleStripeWebhook(request, response)
  }
}
