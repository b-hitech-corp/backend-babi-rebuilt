import type { HttpContext } from '@adonisjs/core/http'
import StatisticsService from '#services/statistic_service'
import { inject } from '@adonisjs/core'

@inject()
export default class StatisticsController {
  private statisticsService: StatisticsService

  constructor() {
    this.statisticsService = new StatisticsService()
  }

  async index({ response }: HttpContext) {
    try {
      const statistics = await this.statisticsService.getStatistics()
      return response.ok(statistics)
    } catch (error) {
      return response.internalServerError({
        message: 'Unable to fetch statistics',
        error: error.message,
      })
    }
  }
}
