# Manual Testing Guide

This guide provides steps for manually testing the "Multi-Properties" plugin in a live Obsidian environment. This is crucial for verifying functionality that is not covered by automated tests, such as UI interactions and file modifications.

## Prerequisites

1.  Ensure you have a dedicated test vault.
2.  Make sure the `OBSIDIAN_TEST_VAULT_PATH` environment variable is set correctly to the path of your test vault.
3.  Install the plugin into your test vault by running `npm run build-and-install:test`.
4.  Initialize the test vault with test notes by running `npm run initialize-test-vault`. This will provide you with a `test-note.md` file to test against.

## Testing Scenarios

### 1. Adding Properties

1.  Open your test vault in Obsidian.
2.  Open the `test-note.md` file.
3.  Open the command palette (Ctrl/Cmd + P).
4.  Run the command "Multi-Properties: Add properties to current note".
5.  The "Add Properties" modal should appear.

#### Scenarios to test:

-   **Add a single text property:**
    -   Enter a property name (e.g., `my-property`).
    -   Enter a value (e.g., `my-value`).
    -   Click "Submit".
    -   **Verification:** Check the frontmatter of `test-note.md`. The new property should be present.
-   **Add multiple properties:**
    -   Click the "Add" button to add more input rows.
    -   Fill in several properties with different names, types, and values.
    -   Click "Submit".
    -   **Verification:** Check the frontmatter of `test-note.md`. All new properties should be present.
-   **Add a list property:**
    -   Enter a property name (e.g., `my-list`).
    -   Select the "Text" type.
    -   Enter a comma-separated value (e.g., `item1,item2,item3`).
    -   Click "Submit".
    -   **Verification:** Check the frontmatter of `test-note.md`. The property should be a list.
-   **Add tags:**
    -   Enter `tags` as the property name.
    -   Enter a comma-separated list of tags (e.g., `tag1,tag2,tag3`).
    -   Click "Submit".
    -   **Verification:** Check the frontmatter of `test-note.md`. The tags should be added to the `tags` property.
-   **Test data types:**
    -   Add properties of different types (Number, Checkbox, Date, Datetime) and verify they are saved correctly in the frontmatter.
-   **Test "Overwrite existing properties" checkbox:**
    -   Add a property that already exists in `test-note.md` (e.g., `aliases`).
    -   First, try adding it with the "Overwrite" checkbox unchecked. It should not overwrite the existing property.
    -   Then, try again with the "Overwrite" checkbox checked. It should overwrite the existing property.
    -   **Verification:** Check the frontmatter of `test-note.md` after each step.

### 2. Removing Properties

1.  Open your test vault in Obsidian.
2.  Open the `test-note.md` file.
3.  Open the command palette (Ctrl/Cmd + P).
4.  Run the command "Multi-Properties: Remove properties from current note".
5.  The "Remove Properties" modal should appear, listing all properties from the current note.

#### Scenarios to test:

-   **Remove a single property:**
    -   Check the box next to one property.
    -   Click "Submit".
    -   A confirmation modal should appear. Click "Continue".
    -   **Verification:** Check the frontmatter of `test-note.md`. The property should be removed.
-   **Remove multiple properties:**
    -   Check the boxes next to several properties.
    -   Use the "Check All" / "Uncheck All" button to test its functionality.
    -   Click "Submit" and confirm.
    -   **Verification:** Check the frontmatter of `test-note.md`. All selected properties should be removed.
-   **Cancel removal:**
    -   Select properties to remove, click "Submit", and then click "Cancel" on the confirmation modal.
    -   **Verification:** Check the frontmatter of `test-note.md`. No properties should be removed.

### 3. Window-Specific Operations

These commands operate on all the files open in the current window. To test this, you will need to have multiple notes open in a split-pane layout.

1.  Open your test vault in Obsidian.
2.  Open several notes (e.g., `Note-01.md`, `Note-02.md`, `Note-03.md`) in a split-pane layout.
3.  Make sure you have one of the panes active.

#### Scenarios to test:

-   **Add properties to open tabs:**
    -   Open the command palette (Ctrl/Cmd + P).
    -   Run the command "Multi-Properties: Add props to open tabs".
    -   Add one or more properties in the modal and click "Submit".
    -   **Verification:** Check the frontmatter of all the open notes in the current window. The new properties should be present in all of them.
-   **Remove properties from open tabs:**
    -   Open the command palette (Ctrl/Cmd + P).
    -   Run the command "Multi-Properties: Remove props from open tabs".
    -   Select one or more properties to remove and click "Submit".
    -   **Verification:** Check the frontmatter of all the open notes in the current window. The selected properties should be removed from all of them.

### 4. Settings Tab

1.  Open Obsidian's settings.
2.  Go to "Community Plugins" and find "Multi-Properties".
3.  Click the gear icon to open the settings tab for the plugin.

#### Scenarios to test:

-   **Change the delimiter:**
    -   Change the delimiter for list properties (e.g., from a comma to a semicolon).
    -   Go back to the "Add Properties" modal and add a list property using the new delimiter.
    -   **Verification:** Check the frontmatter of `test-note.md`. The list should be correctly created using the new delimiter.

### 4. General UI/UX

-   Verify that all modals and forms are visually correct and easy to use.
-   Check for any layout issues, overlapping elements, or incorrect styling.
-   Ensure that the UI is responsive and works well with different screen sizes (if applicable).
-   Test keyboard navigation within the forms (e.g., using Tab to move between inputs).
