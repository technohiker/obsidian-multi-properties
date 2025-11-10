import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import RemoveConfirmForm from "../src/RemoveConfirmForm.svelte";

describe("RemoveConfirmForm.svelte", () => {
  it("should render the component with the correct props", () => {
    const names = ["prop1", "prop2"];
    const { getByText } = render(RemoveConfirmForm, {
      props: {
        names,
        submission: () => {},
        cancel: () => {},
      },
    });

    names.forEach((prop) => {
      expect(getByText(prop)).not.toBeNull();
    });
  });

  it('should call the submission function when the "Delete" button is clicked', async () => {
    const submissionMock = vi.fn();
    const { getByText } = render(RemoveConfirmForm, {
      props: {
        names: ["prop1"],
        submission: submissionMock,
        cancel: () => {},
      },
    });

    const deleteButton = getByText("Delete");
    await fireEvent.click(deleteButton);

    expect(submissionMock).toHaveBeenCalledOnce();
  });
});
