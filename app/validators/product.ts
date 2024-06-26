import vine from '@vinejs/vine'

/**
 * Validates the product's creation action
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape(),
    description: vine.string().trim().escape(),
    stock: vine.number().min(0),
    active: vine.boolean(),
    price: vine.number().min(0),
    categoryId: vine.number().min(1),
  })
)

/**
 * Validates the product's update action
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
