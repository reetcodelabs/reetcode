import { type RouteHandlerMethod } from "fastify"

export interface FastifyRouteConfig {
    url: string;
    method: HTTPMethods | HTTPMethods[];
}

type HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' |
    'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK' | 'TRACE' | 'SEARCH' | 'REPORT' | 'MKCALENDAR'

export type RouteDefinition = {
    config: FastifyRouteConfig
    handler: RouteHandlerMethod
}
