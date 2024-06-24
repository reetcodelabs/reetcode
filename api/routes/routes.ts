import { type FastifyInstance } from "fastify";

import { routes } from '../problems/routes'
import { type RouteDefinition } from "../types";

export function defineRoutes(server: FastifyInstance) {
    routes.forEach(({ config: { method, url }, handler }: RouteDefinition) => {
        server.route({
            method,
            url,
            handler
        })
    })
}
