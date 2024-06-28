export async function fetchFilesInPath(path: string) {
    const response = await fetch(
        `https://problems.reetcode.com/github-file-tree-load-on-interaction/optimized?path=${path}`,
    )

    try {
        const files = await response.json()

        return files
    } catch (error) {
        console.error(`Fetch error: ${error}`)

        return []
    }
}
