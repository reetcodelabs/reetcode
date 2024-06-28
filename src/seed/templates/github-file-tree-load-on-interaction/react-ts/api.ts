export async function fetchFilesInTree() {
    const response = await fetch(
        `https://problems.reetcode.com/github-file-tree-load-on-interaction/`
    );

    try {
        const files = await response.json();

        return files;
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }
}
