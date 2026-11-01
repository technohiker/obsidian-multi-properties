import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import AddPropInput from "../src/AddPropInput.svelte";

describe("AddPropInput.svelte", () => {
  it("should render with default values", () => {
    const { getByPlaceholderText } = render(AddPropInput, {
      props: {
        totalInputs: 1,
        removeInput: () => {},
        id: 1,
        suggestedProps: [],
        autocomplete: true,
      },
    });

    const nameInput = getByPlaceholderText("name") as HTMLInputElement;
    const valueInput = getByPlaceholderText("value") as HTMLInputElement;

    expect(nameInput).not.toBeNull();
    expect(valueInput).not.toBeNull();
    expect(nameInput.value).toBe("");
    expect(valueInput.value).toBe("");
  });

  it("should properly change the type of value when the type input is changed", async () => {
    const { container } = render(AddPropInput, {
      props: {
        totalInputs: 1,
        removeInput: () => {},
        id: 1,
        suggestedProps: [],
        autocomplete: true,
      },
    });

    const typeOption = container.querySelector("#type-input");
    const valueInput = container.querySelector("#value-input");
    if (typeOption) {
      await fireEvent.change(typeOption, { target: { value: "number" } });
      expect(valueInput?.getAttribute("type")).toBe("number");
    }
  });

  it("should call removeInput when the remove button is clicked", async () => {
    const removeInputMock = vi.fn();
    const { container } = render(AddPropInput, {
      props: {
        totalInputs: 2,
        removeInput: removeInputMock,
        id: 1,
        suggestedProps: [],
        autocomplete: true,
      },
    });

    const removeButton = container.querySelector("#del-btn");
    if (removeButton) {
      await fireEvent.click(removeButton);
      expect(removeInputMock).toHaveBeenCalledWith(1);
    }
  });
  it("should NOT call removeInput if it is the only input available", async () => {
    const removeInputMock = vi.fn();
    const { container } = render(AddPropInput, {
      props: {
        totalInputs: 1,
        removeInput: removeInputMock,
        id: 1,
        suggestedProps: [],
        autocomplete: true,
      },
    });

    const removeButton = container.querySelector("#del-btn");
    if (removeButton) {
      await fireEvent.click(removeButton);
      expect(removeInputMock).not.toHaveBeenCalledWith(1);
    }
  });
  it("should display a list of suggestedProps when input has been clicked", async () => {
    const { container } = render(AddPropInput, {
      props: {
        totalInputs: 1,
        removeInput: () => {},
        id: 1,
        suggestedProps: [
          {
            name: "tags",
            widget: "tags",
            occurrences: 1,
          },
          {
            name: "testNumber",
            widget: "number",
            occurrences: 4,
          },
          {
            name: "testDate",
            widget: "date",
            occurrences: 1,
          },
        ],

        autocomplete: true,
      },
    });
    const dataList = container.querySelector("#suggestion-list");
    if (dataList) {
      expect(dataList.children.length).toEqual(3);
    }
  });
  it("should not show list if autocomplete is disabled", async () => {
    const { container } = render(AddPropInput, {
      props: {
        totalInputs: 1,
        removeInput: () => {},
        id: 1,
        suggestedProps: [
          {
            name: "tags",
            widget: "tags",
            occurrences: 1,
          },
          {
            name: "testNumber",
            widget: "number",
            occurrences: 4,
          },
          {
            name: "testDate",
            widget: "date",
            occurrences: 1,
          },
        ],

        autocomplete: false,
      },
    });
    const dataList = container.querySelector("#suggestion-list");
    expect(dataList).toBeNull;
  });
});
