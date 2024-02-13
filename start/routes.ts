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

router
  .group(() => {
    router.resource('products', ProductsController).apiOnly()
  })
  .prefix('api/v1')
