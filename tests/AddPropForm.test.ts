import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import AddPropForm from '../src/AddPropForm.svelte';

describe('AddPropForm.svelte', () => {
  it('should submit the form data when "Submit" is clicked', async () => {
    const submissionMock = vi.fn();
    const changeBoolMock = vi.fn();

    render(AddPropForm, {
      props: {
        submission: submissionMock,
        overwrite: false,
        delimiter: ',',
        defaultProps: [],
        changeBool: changeBoolMock,
      },
    });

    const nameInput = await screen.findByPlaceholderText('name');
    const valueInput = await screen.findByPlaceholderText('value');
    const submitButton = screen.getByText('Submit');

    // Simulate user input
    await fireEvent.input(nameInput, { target: { value: 'newProp' } });
    await fireEvent.input(valueInput, { target: { value: 'newValue' } });

    // Simulate form submission
    await fireEvent.click(submitButton);

    // Check if the submission callback was called with the correct data
    expect(submissionMock).toHaveBeenCalledOnce();
    const submittedProps = submissionMock.mock.calls[0][0];
    expect(submittedProps.get('newProp').data).toBe('newValue');
  });
});




