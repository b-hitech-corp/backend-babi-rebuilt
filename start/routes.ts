/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ProductsController = () => import('#controllers/products_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const OrdersController = () => import('#controllers/orders_controller')
const CartsController = () => import('#controllers/carts_controller')
const NewslettersController = () => import('#controllers/newsletters_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const StripesController = () => import('#controllers/stripes_controller')
const SizesController = () => import('#controllers/sizes_controller')
const ColorsController = () => import('#controllers/colors_controller')

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger", swagger); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", swagger); to use RapiDoc instead
})

// Routes definition
router
  .group(() => {
    // Products and orders routes
    router.get('products/topSelling', [ProductsController, 'topSelling'])
    router.get('products/mostOrdered', [ProductsController, 'mostOrdered'])
    router.resource('products', ProductsController).apiOnly()

    // Categories routes
    router.resource('categories', CategoriesController).apiOnly()

    // Sizes routes
    router.resource('sizes', SizesController).apiOnly()

    // Colors routes
    router.resource('colors', ColorsController).apiOnly()

    // Cart routes
    router.post('cart/add', [CartsController, 'addProductToCart'])

    // Newsletter routes
    router.post('newsletter/suscribe', [NewslettersController, 'addEmail'])
    router.delete('newsletter/unsuscribe/:email', [NewslettersController, 'removeEmail'])
    router.get('newsletter/list', [NewslettersController, 'listEmails'])

    // Auth routes
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])

    // Social auth routes
    router.get('auth/google', ({ ally }) => {
      return ally.use('google').redirect()
    })

    router.get('auth/google/callback', [AuthController, 'handleGoogleCallback'])

    // Stripe Webhook
    router.post('stripe/webhook', [StripesController, 'webhook'])

    // Order routes, protected by auth middleware
    router
      .group(() => {
        router.resource('orders', OrdersController).apiOnly()
      })
      .use(middleware.auth())

    // User routes
    router
      .group(() => {
        router.get('/:id', [UsersController, 'me'])
      })
      .prefix('user')
      .use(middleware.auth())
  })
  .prefix('api/v1')
