import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import AddPropInput from "../src/AddPropInput.svelte";

describe("AddPropInput.svelte", () => {
  it("should render with default values", () => {
    const { getByPlaceholderText } = render(AddPropInput, {
      props: {
        isFirst: true,
        removeInput: () => {},
        id: 1,
      },
    });

    const nameInput = getByPlaceholderText("name") as HTMLInputElement;
    const valueInput = getByPlaceholderText("value") as HTMLInputElement;

    expect(nameInput).not.toBeNull();
    expect(valueInput).not.toBeNull();
    expect(nameInput.value).toBe("");
    expect(valueInput.value).toBe("");
  });

  it("should call removeInput when the remove button is clicked", async () => {
    const removeInputMock = vi.fn();
    const { container } = render(AddPropInput, {
      props: {
        isFirst: false,
        removeInput: removeInputMock,
        id: 1,
      },
    });

    const removeButton = container.querySelector("#del-btn");
    if (removeButton) {
      await fireEvent.click(removeButton);
      expect(removeInputMock).toHaveBeenCalledWith(1);
    }
  });
});
