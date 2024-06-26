// for AdonisJS v6
import path from 'node:path'
import url from 'node:url'
// ---

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // for AdonisJS v6
  title: 'API Documentation',
  version: '1.0.0',
  tagIndex: 3,
  snakeCase: true,
  debug: true, // set to true, to get some useful debug output
  ignore: ['/swagger', '/docs', '/api/v1/stripe/webhook'], // routes to ignore
  preferredPutPatch: 'PUT', // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {
      paginated: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', example: 1 },
          description: 'Page number for pagination',
        },
        {
          in: 'query',
          name: 'perPage',
          schema: { type: 'integer', example: 20 },
          description: 'Number of items per page',
        },
      ],
    }, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
}
