import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape(),
    description: vine.string().trim().escape(),
    stock: vine.number().min(0),
    active: vine.boolean(),
    price: vine.number().min(0),
  })
)

/**
 * Validates the post's update action
 */
export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape(),
    description: vine.string().trim().escape(),
    stock: vine.number().min(0),
    active: vine.boolean(),
    price: vine.number().min(0),
  })
)
