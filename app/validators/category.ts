import vine from '@vinejs/vine'

/**
 * Validates the category's creation action
 */
export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape(),
    description: vine.string().trim().escape(),
  })
)

/**
 * Validates the category's update action
 */
export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape(),
    description: vine.string().trim().escape(),
  })
)
