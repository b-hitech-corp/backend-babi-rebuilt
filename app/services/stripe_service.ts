import Order from '#models/order'
import Product from '#models/product'
import Stripe from 'stripe'

export class StripeService {
  /**
   * Handle stripe webhook
   */
  async handleStripeWebhook(request: any, response: any) {
    // Handle stripe webhook

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const endpoint = process.env.STRIPE_WEBHOOK_SECRET!

    const payload = request.raw()
    const sig = request.header('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpoint)
    } catch (err) {
      return response.badRequest({ message: `Webhook Error: ${err.message}` })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        // Handle successful checkout
        const order = await Order.query().where('stripe_payment_id', session.id).first()
        if (!order) {
          throw new Error('Order not found')
        }
        order.status = session.payment_status
        order.save()
        break

      case 'checkout.session.async_payment_failed':
        // Handle failed payment
        console.log('Payment failed')
        // Send email to customer
        break

      default:
        return response.badRequest({ message: 'Unhandled event type' })
    }

    return response.ok({ received: true })
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(data: any) {
    // Create a checkout session

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Cannot process payment, missing stripe credentials !')
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const cartItems = data.products

    const lineItems = await Promise.all(
      cartItems.map(async (item: any) => {
        const product = await Product.query().where('id', item.product_id).preload('images').first()
        if (!product) {
          throw new Error('Product in cart not found')
        }
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              images: [product.images[0]?.url || ''],
            },
            unit_amount: product.price * 100, // Convert to cents
          },
          quantity: item.quantity,
        }
      })
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    })

    return { session: session }
  }
}
