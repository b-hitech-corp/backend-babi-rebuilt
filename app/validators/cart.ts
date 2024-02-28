import vine from '@vinejs/vine'

/**
 * Validates the order's creation action
 */
export const createOrderValidator = vine.compile(
  vine.object({
    user_id: vine.number().min(1),
    product_id: vine.number().min(1),
    quantity: vine.number().min(1),
  })
)
