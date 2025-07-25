# Obsidian Multi-Properties Plugin

This plugin allows you to add, edit, or remove frontmatter properties from multiple notes at once, streamlining your workflow when managing metadata across your vault.

## Features

You can act on multiple notes at once in several ways:

-   **Folders:** Right-click a folder in the File Explorer to affect all notes within it (and optionally, all sub-folders).
-   **File Selections:** Select multiple files using `Shift+Click` or `Ctrl/Cmd+Click`, then right-click the selection.
-   **Search Results:** After performing a search, right-click the search pane to modify all resulting notes.
-   **All Open Tabs:** Run a command to add or remove properties from all currently open tabs in the active window.

### Actions

-   **Add/Edit Properties:** A form will appear allowing you to input new properties and their values. If a property already exists on a note, you can choose to either overwrite its value or append to it (for text-based properties).
-   **Remove Properties:** A form will list all unique properties found within the selected notes. You can then choose which properties to permanently remove from all targeted notes.

### Settings

-   **Overwrite Existing Properties:** Toggle whether to replace or append to existing property values.
-   **Recursive Folder Operations:** Choose whether actions on folders should apply to notes in sub-folders.
-   **List Delimiter:** Set a custom delimiter for list-type properties.
-   **Default Properties File:** Specify a note to load a default set of properties from when adding new ones.

---

## Development Guide

Follow these instructions to set up a local development environment. This project requires a dedicated, separate Obsidian vault for running automated tests.

### Prerequisites

-   [Node.js](https://nodejs.org/)
-   The [Obsidian](https://obsidian.md/) application.

### Step 1: Create and Configure the Test Vault

1.  **Create a New Vault:** Open the Obsidian application and create a new, empty vault. This vault will be used exclusively for running automated tests. You can name it anything you like (e.g., "Multi-Properties Test Vault").
2.  **Set the Environment Variable:** You must tell the project scripts where to find this new vault by setting the `OBSIDIAN_TEST_VAULT_PATH` environment variable. Set it to the **absolute path** of the test vault you just created.

    **Windows (PowerShell):**
    ```powershell
    $env:OBSIDIAN_TEST_VAULT_PATH="C:\Users\YourUser\Documents\Obsidian\Multi-Properties-Test-Vault"
    ```

    **macOS/Linux (bash/zsh):**
    ```bash
    export OBSIDIAN_TEST_VAULT_PATH="/Users/YourUser/Documents/Obsidian/Multi-Properties-Test-Vault"
    ```

### Step 2: Initial Project Setup

Clone the repository and install the necessary Node.js dependencies.

```bash
git clone https://github.com/your-username/obsidian-multi-properties.git
cd obsidian-multi-properties
npm install
```

### Step 3: Initialize the Test Vault

Now, run the initialization script. This command will copy the necessary test notes from the `test-notes` directory into your configured test vault.

```bash
npm run initialize-test-vault
```

### Step 4: Build, Install, and Test

The build and installation scripts have been streamlined for a more modular workflow.

1.  **Build the Plugin:** Compiles the TypeScript source into `main.js`.
    ```bash
    npm run build
    ```
    *(Use `npm run dev` for automatic rebuilding during development.)*

2.  **Install the Plugin:** After building, you can install the plugin into your desired vault.
    -   **Test Vault:** `npm run install:test`
    -   **Personal Vault:** `npm run install:personal`

3.  **Build and Install Together:** To build and install in a single step, you can use these convenience scripts:
    -   **Test Vault:** `npm run build-and-install:test`
    -   **Personal Vault:** `npm run build-and-install:personal`

4.  **Run Tests:** Execute the automated test suite. This command assumes the plugin has already been built and installed in the test vault.
    ```bash
    npm test
    ```

### Testing

This project uses [Vitest](https://vitest.dev/) for unit and component testing and the [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/) for interacting with Svelte components. The test suite covers all major UI components and utility functions, ensuring a stable and reliable codebase.

All tests are located in the `tests/` directory.

## Manual Testing Guide

This guide provides steps for manually testing the "Multi-Properties" plugin in a live Obsidian environment. This is crucial for verifying functionality that is not covered by automated tests, such as UI interactions and file modifications.

### Prerequisites

1.  Ensure you have a dedicated test vault.
2.  Make sure the `OBSIDIAN_TEST_VAULT_PATH` environment variable is set correctly to the path of your test vault.
3.  Install the plugin into your test vault by running `npm run build-and-install:test`.
4.  **Enable the Plugin:** In your test vault, go to `Settings > Community Plugins`, find "Multi Properties", and toggle it on.
5.  Initialize the test vault with test notes by running `npm run initialize-test-vault`. This will provide you with a `test-note.md` file to test against.

### Testing Scenarios

#### 1. Adding Properties

1.  Open your test vault in Obsidian.
2.  Open the `test-note.md` file.
3.  Open the command palette (Ctrl/Cmd + P).
4.  Run the command "Multi-Properties: Add properties to current note".
5.  The "Add Properties" modal should appear.

##### Scenarios to test:

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

#### 2. Removing Properties

1.  Open your test vault in Obsidian.
2.  Open the `test-note.md` file.
3.  Open the command palette (Ctrl/Cmd + P).
4.  Run the command "Multi-Properties: Remove properties from current note".
5.  The "Remove Properties" modal should appear, listing all properties from the current note.

##### Scenarios to test:

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

#### 3. Window-Specific Operations

These commands operate on all the files open in the current window. To test this, you will need to have multiple notes open in a split-pane layout.

1.  Open your test vault in Obsidian.
2.  Open several notes (e.g., `Note-01.md`, `Note-02.md`, `Note-03.md`) in a split-pane layout.
3.  Make sure you have one of the panes active.

##### Scenarios to test:

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

#### 4. Settings Tab

1.  Open Obsidian's settings.
2.  Go to "Community Plugins" and find "Multi-Properties".
3.  Click the gear icon to open the settings tab for the plugin.

##### Scenarios to test:

-   **Change the delimiter:**
    -   Change the delimiter for list properties (e.g., from a comma to a semicolon).
    -   Go back to the "Add Properties" modal and add a list property using the new delimiter.
    -   **Verification:** Check the frontmatter of `test-note.md`. The list should be correctly created using the new delimiter.

#### 4. General UI/UX

-   Verify that all modals and forms are visually correct and easy to use.
-   Check for any layout issues, overlapping elements, or incorrect styling.
-   Ensure that the UI is responsive and works well with different screen sizes (if applicable).
-   Test keyboard navigation within the forms (e.g., using Tab to move between inputs).

### Personal Vault Scripts (Optional)

-   `npm run open-personal-vault`: Opens your personal vault in Obsidian (requires `OBSIDIAN_PERSONAL_VAULT_PATH` to be set).

## Installation

This plugin is available in the Obsidian community plugin store. You can install it directly from within the Obsidian app by going to `Settings > Community Plugins > Browse` and searching for "Multi Properties".

For manual installation:

1.  Download the latest release from the [releases page](https://github.com/fez-github/obsidian-multi-properties/releases).
2.  Extract the contents of the zip file.
3.  Copy the extracted folder to your vault's plugin folder: `<your-vault>/.obsidian/plugins/`.
