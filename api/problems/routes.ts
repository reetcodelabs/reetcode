import { type RouteDefinition } from '../types'
import { routes as ghFileTreeRoute } from './github-file-tree-load-on-interaction/api'

export const routes: RouteDefinition[] = [...ghFileTreeRoute]
