import Product from '#models/product'
import Stripe from 'stripe'

export class StripeService {
  /**
   * Handle stripe webhook
   */
  async handleStripeWebhook() {
    // Handle stripe webhook
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
