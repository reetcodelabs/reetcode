import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { fetchFilesInTree } from "./api";
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
  const [tree, setTree] = useState<TreeFilePath[]>([]);
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

  useEffect(() => {
    async function loadFiles() {
      setIsLoading(true);
      const files = await fetchFilesInTree();
      setIsLoading(false);

      setTree(files);
    }

    loadFiles();
  }, [setIsLoading]);

  const onPathSelected = useCallback(
    (item: TreeFilePath) => {
      setPath(item?.path);

      if (item?.type === "blob") {
        return;
      }

      togglePathExpanded(item?.path);
    },
    [tree],
  );

  const sortedTree = [...tree];

  sortedTree.sort((file) => (file.type === "tree" ? -1 : 1));

  return (
    <div className="tree-container">
      <nav className="tree-navigation">
        <ul className="tree-list">
          {sortedTree.map((file) => (
            <TreeItem
              item={file}
              key={file.sha}
              selectedPath={path}
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
  item,
  expandedPaths,
  onPathSelected,
  selectedPath,
}: PropsWithChildren<{
  item: TreeFilePath;
  selectedPath: string;
  expandedPaths: Record<string, boolean>;
  onPathSelected?: (item: TreeFilePath) => void;
}>) {
  const expanded = expandedPaths[item.path];

  const sortedSubTree = [...item.subtree];

  sortedSubTree.sort((file) => (file.type === "tree" ? -1 : 1));

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

          <span className="tree-item-folder-name">{item.path}</span>
        </div>
      </button>

      {sortedSubTree.length > 0 && expanded ? (
        <ul className="tree-list tree-list-nested">
          {sortedSubTree.map((subtreeItem) => (
            <TreeItem
              item={subtreeItem}
              key={subtreeItem.sha}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onPathSelected={onPathSelected}
            />
          ))}
        </ul>
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
