import vine from '@vinejs/vine'

/**
 * Validates the order's creation action
 */
export const createNewsletterSubscriberValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
