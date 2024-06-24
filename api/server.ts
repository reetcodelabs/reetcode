import { consola } from 'consola'
import fastify from 'fastify'

import { defineRoutes } from './routes/routes'

const server = fastify({
    logger: true
})

defineRoutes(server)

server.listen({ port: 4400, host: '0.0.0.0' }, (error, address) => {
    if (error) {
        server.log.error(error)
        process.exit(1)
    }

    consola.info(`Server running on address: ${address}`)
})
