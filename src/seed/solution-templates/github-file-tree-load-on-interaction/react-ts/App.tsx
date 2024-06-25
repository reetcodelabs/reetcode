import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
} from "react";
import classNames from "classnames";
import { fetchFilesInPath } from "./api";
import { Icons } from "./Icons";
import { TreeFilePath } from "./types";

function FilesContainerHeader() {
  return (
    <div className="files-container-header">
      <button className="files-container-header-button">
        {Icons.filesMenu}
      </button>

      <h2 className="files-container-header-title">Files</h2>
    </div>
  );
}

function FilesContainer() {
  return (
    <div className="files-container">
      <FilesContainerHeader />
      <TreeContainer />
    </div>
  );
}

function TreeContainer() {
  const [path, setPath] = useState("");
  const [tree, setTree] = useState<Record<string, TreeFilePath[]>>({});
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>(
    {},
  );

  const [isLoading, setIsLoading] = useState(false);

  const togglePathExpanded = (path = "") => {
    if (!path) {
      return;
    }
    setExpandedPaths((current) => ({ ...current, [path]: !current[path] }));
  };

  const loadFilesForPath = async (path = "") => {
    togglePathExpanded(path);

    if (tree[path]) {
      return;
    }

    setIsLoading(true);

    const files = await fetchFilesInPath(path);

    setIsLoading(false);

    const key = path ? path : "/";

    setTree((current) => ({ ...current, [key]: files }));

    return files;
  };

  useEffect(() => {
    loadFilesForPath(path);
  }, [setIsLoading]);

  const rootFiles = useMemo(() => {
    const files = tree["/"] ?? [];

    files.sort((file) => (file.type === "tree" ? -1 : 1));

    return files;
  }, [tree]);

  const onPathSelected = useCallback(
    (item: TreeFilePath) => {
      setPath(item?.path);

      if (item?.type === "blob") {
        return;
      }

      loadFilesForPath(item?.path);
    },
    [tree],
  );

  return (
    <div className="tree-container">
      <nav className="tree-navigation">
        <ul className="tree-list">
          {rootFiles.map((file) => (
            <TreeItem
              item={file}
              tree={tree}
              key={file.sha}
              selectedPath={path}
              isLoading={isLoading}
              expandedPaths={expandedPaths}
              onPathSelected={onPathSelected}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}

function TreeItem({
  children,
  item,
  tree,
  parent,
  isLoading,
  expandedPaths,
  onPathSelected,
  selectedPath,
}: PropsWithChildren<{
  item: TreeFilePath;
  parent?: TreeFilePath;
  isLoading: boolean;
  selectedPath: string;
  tree: Record<string, TreeFilePath[]>;
  expandedPaths: Record<string, boolean>;
  onPathSelected?: (item: TreeFilePath) => void;
}>) {
  const expanded = expandedPaths[item.path];

  const treeFiles = useMemo(() => {
    const files = tree[item.path] ?? [];

    files.sort((file) => (file.type === "tree" ? -1 : 1));

    return files;
  }, [tree, item]);

  const fileDisplayName = parent
    ? item.path.split(`${parent.path}/`)[1]
    : item.path;

  return (
    <li className="tree-item">
      <button
        onClick={() => item?.path && onPathSelected?.(item)}
        className={`tree-item-header tree-item-header-${item?.type}`}
      >
        {item?.type === "tree" && (
          <div className="tree-item-expand">
            <svg
              className={classNames("tree-item-expand-icon", {
                "tree-item-expand-icon-expanded": expanded,
              })}
              viewBox="0 0 12 12"
              width="12"
              height="12"
              fill="currentColor"
            >
              <path d="M4.7 10c-.2 0-.4-.1-.5-.2-.3-.3-.3-.8 0-1.1L6.9 6 4.2 3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l3.3 3.2c.3.3.3.8 0 1.1L5.3 9.7c-.2.2-.4.3-.6.3Z"></path>
            </svg>
          </div>
        )}

        <div className="tree-item-folder">
          {item?.type === "blob"
            ? Icons.file
            : expanded
              ? Icons.expandedFolder
              : Icons.collapsedFolder}

          <span className="tree-item-folder-name">{fileDisplayName}</span>
        </div>
      </button>

      {expanded ? (
        <>
          <ul className="tree-list tree-list-nested">
            {item.path === selectedPath && isLoading && (
              <div className="tree-loading-items">
                {Icons.spinner}
                <span className="tree-loading-items-text">Loading...</span>
              </div>
            )}
            {treeFiles.map((file) => (
              <TreeItem
                item={file}
                tree={tree}
                parent={item}
                key={file.sha}
                isLoading={isLoading}
                selectedPath={selectedPath}
                expandedPaths={expandedPaths}
                onPathSelected={onPathSelected}
              />
            ))}
          </ul>
        </>
      ) : null}

      {children ? (
        <ul className="tree-list tree-list-nested">{children}</ul>
      ) : null}
    </li>
  );
}

export default function App() {
  return (
    <main>
      <FilesContainer />
    </main>
  );
}
