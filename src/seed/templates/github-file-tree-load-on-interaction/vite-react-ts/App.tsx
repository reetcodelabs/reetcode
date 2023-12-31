import React, { PropsWithChildren } from "react";
import classNames from "classnames";

const Icons = {
  expandedFolder: (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      className="tree-item-folder-collapsed-icon"
    >
      <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z"></path>
    </svg>
  ),
  collapsedFolder: (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      className="tree-item-folder-expanded-icon"
    >
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path>
    </svg>
  ),
};

function FilesContainerHeader() {
  return (
    <div className="files-container-header">
      <button className="files-container-header-button">
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          className="files-container-header-icon"
        >
          <path d="m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z"></path>
          <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z"></path>
        </svg>
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
  return (
    <div className="tree-container">
      <nav className="tree-navigation">
        <ul className="tree-list">
          <TreeItem />
          <TreeItem expanded>
            <TreeItem />
            <TreeItem />
            <TreeItem expanded />
            <TreeItem />
            <TreeItem />
          </TreeItem>
          <TreeItem />
          <TreeItem expanded>
            <TreeItem />
            <TreeItem />
            <TreeItem expanded />
            <TreeItem />
            <TreeItem />
          </TreeItem>
        </ul>
      </nav>
    </div>
  );
}

function TreeItem({
  expanded,
  children,
}: PropsWithChildren<{ expanded?: boolean }>) {
  return (
    <li className="tree-item">
      <div className="tree-item-header">
        <button className="tree-item-expand">
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
        </button>

        <button className="tree-item-folder">
          {expanded ? Icons.expandedFolder : Icons.collapsedFolder}

          <span className="tree-item-folder-name">examples</span>
        </button>
      </div>

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
