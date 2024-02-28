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

router
  .group(() => {
    router.resource('products', ProductsController).apiOnly()
    router.resource('orders', OrdersController).apiOnly()

    router.post('cart/add', [CartsController, 'addProductToCart'])
  })
  .prefix('api/v1')
