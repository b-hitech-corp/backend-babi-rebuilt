import vine from '@vinejs/vine'

/**
 * Validates the order's creation action
 */
export const createOrderValidator = vine.compile(
  vine.object({
    total_price: vine.number().min(0),
    shipping_address: vine.string().trim().escape(),
    payment_method: vine.string().trim().escape(),
    phone_number: vine.string().trim().escape(),
    notes: vine.string().trim().escape().optional(),
    products: vine.array(
      vine.object({ product_id: vine.number().min(1), quantity: vine.number().min(1) })
    ),
  })
)

/**
 * Validates the order's update action
 */
export const updateOrderValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'processing', 'shipped', 'delivered', 'canceled']),
    shipping_address: vine.string().trim().escape().optional(),
    phone_number: vine.string().trim().escape().optional(),
    payment_method: vine.string().trim().escape().optional(),
    notes: vine.string().trim().escape().optional(),
    products: vine
      .array(
        vine.object({ product_id: vine.number().min(1), quantity: vine.number().min(1) }).optional()
      )
      .optional(),
    total_price: vine.number().min(0).optional(),
  })
)
