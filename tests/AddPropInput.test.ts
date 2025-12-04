import { render, fireEvent } from "@testing-library/svelte";
import { expect, test, describe, vi } from "vitest";
import AddPropInput from "../src/AddPropInput.svelte";
import "@testing-library/jest-dom";

describe("AddPropInput.svelte", () => {
  test("should render with default values", () => {
    const { getByPlaceholderText, getByRole } = render(AddPropInput);

    // Check for default values
    expect(getByPlaceholderText("name")).toHaveValue("");
    expect(getByPlaceholderText("value")).toHaveValue("");
    expect(getByRole("combobox")).toHaveValue("string");
  });
});
