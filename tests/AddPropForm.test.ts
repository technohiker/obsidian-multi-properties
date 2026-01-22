import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/svelte";
import AddPropForm from "../src/AddPropForm.svelte";
import type { Property } from "src/types/custom";

describe("AddPropForm.svelte", () => {
  it('should submit the form data when "Submit" is clicked', async () => {
    const submissionMock = vi.fn();
    const changeSettingMock = vi.fn();

    render(AddPropForm, {
      props: {
        submission: submissionMock,
        alterProp: "ignore",
        delimiter: ",",
        defaultProps: [],
        changeSetting: changeSettingMock,
        suggestedProps: [],
      },
    });

    const nameInput = await screen.findByPlaceholderText("name");
    const valueInput = await screen.findByPlaceholderText("value");
    const submitButton = screen.getByText("Submit");

    // Simulate user input
    await fireEvent.input(nameInput, { target: { value: "newProp" } });
    await fireEvent.input(valueInput, { target: { value: "newValue" } });

    // Simulate form submission
    await fireEvent.click(submitButton);

    // Check if the submission callback was called with the correct data
    expect(submissionMock).toHaveBeenCalledOnce();
    const submittedProps = submissionMock.mock.calls[0][0];
    expect(submittedProps.get("newProp").data).toBe("newValue");
  });
  it('should add a new input field when the "Add" button is clicked', async () => {
    const submissionMock = vi.fn();
    const changeSettingMock = vi.fn();

    render(AddPropForm, {
      props: {
        submission: submissionMock,
        alterProp: "ignore",
        delimiter: ",",
        defaultProps: [],
        changeSetting: changeSettingMock,
        suggestedProps: [],
      },
    });

    const addButton = await screen.findByText<HTMLButtonElement>("Add");

    await fireEvent.click(addButton);

    const inputs = document.querySelectorAll(".modal-input-container");
    expect(inputs.length).toBe(2);
  });

  it("Should change the alterProp setting when user changes the dropdown", async () => {
    const submissionMock = vi.fn();
    const changeSettingMock = vi.fn();

    render(AddPropForm, {
      props: {
        submission: submissionMock,
        alterProp: "ignore",
        delimiter: ",",
        defaultProps: [],
        changeSetting: changeSettingMock,
        suggestedProps: [],
      },
    });

    const alterPropSelect =
      screen.getAllByRole<HTMLSelectElement>("combobox")[0];

    await fireEvent.change(alterPropSelect, { target: { value: "overwrite" } });

    expect(changeSettingMock).toHaveBeenCalledWith("overwrite");
    expect(alterPropSelect.value).toBe("overwrite");
  });

  it("Should show a list of all available properties", async () => {
    const submissionMock = vi.fn();
    const changeSettingMock = vi.fn();

    const properties: Property[] = [
      {
        name: "prop1",
        widget: "text",
        occurrences: 1,
      },
      {
        name: "prop2",
        widget: "text",
        occurrences: 1,
      },
      {
        name: "prop3",
        widget: "text",
        occurrences: 1,
      },
    ];

    render(AddPropForm, {
      props: {
        submission: submissionMock,
        alterProp: "ignore",
        delimiter: ",",
        defaultProps: [],
        changeSetting: changeSettingMock,
        suggestedProps: properties,
      },
    });

    const suggestedProps = document.querySelectorAll(".suggested-prop");
    expect(suggestedProps).toHaveLength(3);
  });
});
