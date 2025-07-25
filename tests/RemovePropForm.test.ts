import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RemovePropForm from '../src/RemovePropForm.svelte';

describe('RemovePropForm.svelte', () => {
  const names = ['prop1', 'prop2', 'prop3'];

  it('should render the form with checkboxes for each property name', () => {
    const { getByText } = render(RemovePropForm, {
      props: {
        names,
        submission: () => {},
      },
    });

    names.forEach((name) => {
      expect(getByText(name)).not.toBeNull();
    });
  });

  it('should call the submission function with the selected properties', async () => {
    const submissionMock = vi.fn();
    const { getByText, getByLabelText } = render(RemovePropForm, {
      props: {
        names,
        submission: submissionMock,
      },
    });

    const checkbox2 = getByLabelText('prop2');
    const checkbox3 = getByLabelText('prop3');
    const submitButton = getByText('Confirm');

    await fireEvent.click(checkbox2);
    await fireEvent.click(checkbox3);
    await fireEvent.click(submitButton);

    expect(submissionMock).toHaveBeenCalledOnce();
    expect(submissionMock).toHaveBeenCalledWith(['prop2', 'prop3']);
  });

  it('should show an error if no properties are selected on submit', async () => {
    const { getByText } = render(RemovePropForm, {
      props: {
        names,
        submission: () => {},
      },
    });

    const submitButton = getByText('Confirm');
    await fireEvent.click(submitButton);

    const errorElement = document.getElementById('alert-text');
    if (errorElement) {
      expect(errorElement.textContent).toBe('Please select at least one property to remove.');
    }
  });

  it('should toggle all checkboxes when "Check All" / "Uncheck All" is clicked', async () => {
    const submissionMock = vi.fn();
    const { getByText, getByLabelText } = render(RemovePropForm, {
      props: {
        names,
        submission: submissionMock,
      },
    });

    const toggleAllButton = getByText('Check All');
    await fireEvent.click(toggleAllButton);

    let checkbox1 = getByLabelText('prop1') as HTMLInputElement;
    let checkbox2 = getByLabelText('prop2') as HTMLInputElement;
    let checkbox3 = getByLabelText('prop3') as HTMLInputElement;

    expect(checkbox1.checked).toBe(true);
    expect(checkbox2.checked).toBe(true);
    expect(checkbox3.checked).toBe(true);

    await fireEvent.click(toggleAllButton);

    checkbox1 = getByLabelText('prop1') as HTMLInputElement;
    checkbox2 = getByLabelText('prop2') as HTMLInputElement;
    checkbox3 = getByLabelText('prop3') as HTMLInputElement;

    expect(checkbox1.checked).toBe(false);
    expect(checkbox2.checked).toBe(false);
    expect(checkbox3.checked).toBe(false);
  });
});
