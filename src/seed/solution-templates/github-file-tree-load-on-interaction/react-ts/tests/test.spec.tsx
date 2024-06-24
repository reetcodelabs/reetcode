import React from "react";
import { render, screen, act } from "@testing-library/react";
import { expect, test } from "@jest/globals";

import App from "../App";

test("the default value displayed to the user is 12", async () => {
  render(<App />);

  const valueText = screen.queryByText(/Value: 12/);

  expect(valueText?.textContent).toEqual(`Value: 12`);
});

test("clicking the increment button increases the value by ten", async () => {
  render(<App />);
  
  await act(() => {
    screen.queryByText("Increment value")?.click();
  });
  
  const valueText = screen.queryByText(/Value: 22/);

 expect(valueText?.textContent).toEqual(`Value: 22`);
});

test("clicking the decrement button increases the value by ten", async () => {
  render(<App />);

  await act(() => {
    screen.queryByText("Decrement value")?.click();
  });

  const valueText = screen.queryByText(/Value: 2/);

  expect(valueText?.textContent).toEqual(`Value: 2`);
});