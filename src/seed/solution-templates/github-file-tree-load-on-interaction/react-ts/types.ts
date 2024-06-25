export interface TreeFilePath {
    path: string;
    sha: string;
    type: "blob" | "tree";
}
