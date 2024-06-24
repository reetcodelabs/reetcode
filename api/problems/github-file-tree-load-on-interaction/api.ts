import Fs from 'node:fs'
import Path from 'node:path'

import { type RouteHandlerMethod } from "fastify";

import { type RouteDefinition } from "../../types";

export const config: RouteDefinition['config'] = {
    url: '/github-file-tree-load-on-interaction',
    method: 'GET'
}

interface TreeItem {
    "path": string,
    "type": "tree" | 'blob',
    "sha": string,
}

export const handler: RouteHandlerMethod = async (request, response) => {
    const files = JSON.parse(Fs.readFileSync(Path.resolve(__dirname, 'data', 'gh_api.json')).toString()) as { tree: TreeItem[] }
    const params = request.query as Record<string, string>

    let path = params.path ?? ''

    if (path.endsWith('/')) {
        path = path.slice(0, -1)
    }

    if (!path) {
        const results = files.tree.filter(item => item.path.split('/').length === 1)

        await response.send(results)

        return
    }

    const treeItem = files.tree.find(item => item?.path === path)

    if (!treeItem) {
        await response.send([])
        return
    }

    const immediateTreeItems = files.tree.filter(item => {
        const [, deepPath] = item.path.split(treeItem.path)

        return item.path.startsWith(treeItem.path) && deepPath?.split('/')?.length === 2
    })

    await response.send(immediateTreeItems.map(({ path, type, sha }) => ({
        path,
        type,
        sha
    })))
}

export const routes: RouteDefinition[] = [{ config, handler }]
