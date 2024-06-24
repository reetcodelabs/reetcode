import Fs from 'node:fs'
import Path from 'node:path'
import { fileURLToPath } from 'node:url'

import { type RouteDefinition } from "../../types";

interface TreeItem {
    "path": string,
    "type": "tree" | 'blob',
    "sha": string,
}

function getCurrentDirectory() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = Path.dirname(__filename);

    return __dirname
}

export const routes: RouteDefinition[] = [{
    config: {
        url: '/github-file-tree-load-on-interaction/optimized',
        method: 'GET'
    },
    async handler(request, response) {
        const files = JSON.parse(
            Fs.readFileSync(
                Path.resolve(
                    getCurrentDirectory(),
                    'data',
                    'gh_api.json'
                )
            ).toString()
        ) as { tree: TreeItem[] }

        const params = request.query as Record<string, string>

        let path = params.path ?? ''

        if (path.endsWith('/')) {
            path = path.slice(0, -1)
        }

        function transformFiles({ path, type, sha }: TreeItem) {
            return ({
                path,
                type,
                sha
            })
        }

        if (!path) {
            const results = files.tree.filter(item => item.path.split('/').length === 1)

            await response.send(results.map(transformFiles))

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

        await response.send(immediateTreeItems.map(transformFiles))
    },
}, {
    config: {
        url: '/github-file-tree-load-on-interaction/',
        method: 'GET'
    },
    async handler(request, response) {
        const tree = JSON.parse(
            Fs.readFileSync(
                Path.resolve(
                    getCurrentDirectory(),
                    'data',
                    'gh_api_tree.json'
                )
            ).toString()
        )

        await response.send(tree)
    }
}]
