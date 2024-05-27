import Order from '#models/order'
import Product from '#models/product'
import User from '#models/user'

export default class StatisticsService {
  // Récupère le total des commandes
  async getTotalOrders(): Promise<number> {
    const totalOrders = await Order.query().count('* as total')
    return totalOrders[0].$extras.total
  }

  // Récupère le total des ventes
  async getTotalSales(): Promise<number> {
    const totalSales = await Order.query().sum('total_price as total')
    return totalSales[0].$extras.total
  }

  // Récupère les 10 dernières commandes
  async getLast10Orders(): Promise<Order[]> {
    const lastOrders = await Order.query()
      .orderBy('created_at', 'desc')
      .limit(10)
      .preload('products')
    return lastOrders
  }

  // Récupère le total des utilisateurs
  async getTotalUsers(): Promise<number> {
    const totalUsers = await User.query().count('* as total')
    return totalUsers[0].$extras.total
  }

  // Récupère le produit le plus vendu
  async getTopSellingProduct(): Promise<{ product: Product; totalSold: number }> {
    const topProduct = await Product.query()
      .select('products.*')
      .join('order_product', 'products.id', 'order_product.product_id')
      .sum('order_product.quantity as total_sold')
      .groupBy('products.id')
      .orderBy('total_sold', 'desc')
      .first()

    console.log('topProduct', topProduct)
    console.log('topProduct', topProduct!.$extras.total_sold)

    return {
      product: topProduct!,
      totalSold: topProduct!.$extras.total_sold,
    }
  }

  // Calcule la valeur moyenne des commandes
  calculateAverageOrderValue(totalSales: number, totalOrders: number): number {
    if (totalOrders === 0) {
      return 0
    }
    const average = totalSales / totalOrders
    return Number.parseFloat(average.toFixed(2))
  }

  // Méthode pour récupérer toutes les statistiques
  async getStatistics(): Promise<any> {
    const [totalOrders, totalSales, last10Orders, totalUsers] = await Promise.all([
      this.getTotalOrders(),
      this.getTotalSales(),
      this.getLast10Orders(),
      this.getTotalUsers(),
      //this.getTopSellingProduct(),
    ])
    const averageOrderValue = this.calculateAverageOrderValue(totalSales, totalOrders)

    return {
      totalOrders,
      totalSales,
      last10Orders,
      totalUsers,
      averageOrderValue,
    }
  }
}
