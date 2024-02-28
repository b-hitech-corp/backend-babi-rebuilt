/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ProductsController = () => import('#controllers/products_controller')
const OrdersController = () => import('#controllers/orders_controller')
const CartsController = () => import('#controllers/carts_controller')
const NewslettersController = () => import('#controllers/newsletters_controller')

router
  .group(() => {
    // Products and orders routes
    router.resource('products', ProductsController).apiOnly()
    router.resource('orders', OrdersController).apiOnly()

    // Cart routes
    router.post('cart/add', [CartsController, 'addProductToCart'])

    // Newsletter routes
    router.post('newsletter/suscribe', [NewslettersController, 'addEmail'])
    router.delete('newsletter/unsuscribe/:email', [NewslettersController, 'removeEmail'])
    router.get('newsletter/list', [NewslettersController, 'listEmails'])
  })
  .prefix('api/v1')
