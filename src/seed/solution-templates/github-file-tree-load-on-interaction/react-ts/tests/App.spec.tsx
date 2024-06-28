import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import {
  mockTreePaths,
  packagesCliTreePaths,
  packagesTreePaths,
} from "./mocks/handlers";

import App from "../App";

test("Display all repository files and folders at root>>>This test will check that once the page loads, all the repository files and folders are fetched from the api and displayed to the user.", async () => {
  render(<App />);

  await waitFor(() => {
    mockTreePaths.forEach((item) => {
      expect(
        screen.getByText(item.path),
        `We couldn't find the ${item.type === "blob" ? "file" : "folder"} "${item.path}" displayed on the page. Please make sure it is displayed properly on the page.`,
      ).toBeInTheDocument();
    });
  });
});

test("Clicking a file in the tree does not take any action.>>>This test will check that when a user clicks a file, no action is performed such as fetching or other operations.", async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(".eslintignore")).toBeInTheDocument();
  });

  await userEvent.click(screen.getByText(".eslintignore"));

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});

test("Clicking a folder in the tree makes an API call to fetch the content of that folder.>>>This test will ensure that when a user clicks on a folder, the software fetches the content of the clicked path and displays the content.", async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("packages")).toBeInTheDocument();
  });

  const folder = screen.getByText("packages")?.parentElement?.parentElement!;

  await userEvent.click(folder);

  await waitFor(() => {
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  await waitFor(() => {
    packagesTreePaths.forEach((item) => {
      const pathName = item.path.split("packages/")[1];
      expect(
        screen.getByText(pathName),
        `We couldn't find the ${item.type === "blob" ? "file" : "folder"} "${pathName}" displayed on the page. Please make sure it is displayed properly on the page.`,
      ).toBeInTheDocument();
    });
  });

  // packagesTreePaths.forEach(() => {

  // })
});

test("Clicking a second level nested folder in the tree makes an API call to fetch the content of that folder.>>>This test will ensure that when a user clicks on a folder, the software fetches the content of the clicked path and displays the content.", async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("packages")).toBeInTheDocument();
  });

  const folder = screen.getByText("packages")?.parentElement?.parentElement!;

  await userEvent.click(folder);

  const firstTree = packagesTreePaths.find((item) => item.type === "tree")!;
  const pathName = firstTree.path.split("packages/")[1];

  await waitFor(() => {
    expect(
      screen.getByText(pathName),
      `We couldn't find the ${firstTree.type === "blob" ? "file" : "folder"} "${pathName}" displayed on the page. Please make sure it is displayed properly on the page.`,
    ).toBeInTheDocument();
  });

  const secondLevelFolder =
    screen.getByText("cli")?.parentElement?.parentElement!;

  await userEvent.click(secondLevelFolder);

  await waitFor(() => {
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  await waitFor(() => {
    packagesCliTreePaths.forEach((item) => {
      const pathName = item.path.split("packages/cli/")[1];

      expect(
        screen.getByText(pathName),
        `We couldn't find the ${item.type === "blob" ? "file" : "folder"} "${pathName}" displayed on the page in the second level nested folder. Please make sure it is displayed properly when a user clicks a folder two levels deep.`,
      ).toBeInTheDocument();
    });
  });
});
