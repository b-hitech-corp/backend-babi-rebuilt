import vine from '@vinejs/vine'
export const registerValidator = vine.compile(
  vine.object({
    first_name: vine.string(),
    last_name: vine.string(),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
    password: vine.string().minLength(6).maxLength(32),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
