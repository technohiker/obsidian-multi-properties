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

### Step 3: Full Test Environment Setup

For a complete one-step setup, run the new `setup:test` script. This is the recommended way to get your test environment ready.

This single command will:
1.  **Build** the plugin from source.
2.  **Install** the built plugin into your test vault.
3.  **Initialize** the vault by cleaning it and copying over the latest test notes.

```bash
npm run setup:test
```

After the script finishes, you will need to **manually enable the plugin** in your test vault's settings (`Settings > Community Plugins`).

### Step 4: Build, Install, and Test (Manual Steps)

If you prefer to run the steps individually, you can use the following scripts. This is useful if you only want to update the plugin code without resetting the test notes, for example.

1.  **Build the Plugin:** Compiles the TypeScript source into `main.js`.
    ```bash
    npm run build
    ```
    *(Use `npm run dev` for automatic rebuilding during development.)*

2.  **Install the Plugin:** After building, you can install the plugin into your desired vault.
    -   **Test Vault:** `npm run install:test`
    -   **Personal Vault:** `npm run install:personal`

3.  **Initialize the Test Vault:** This command will clean your test vault and copy the necessary test notes from the `test-notes` directory.
    ```bash
    npm run initialize-test-vault
    ```

4.  **Run Tests:** Execute the automated test suite.
    ```bash
    npm test
    ```

### Testing

This project uses [Vitest](https://vitest.dev/) for unit and component testing. These tests cover individual functions and UI components in isolation. All Vitest tests are located in the `tests/` directory and can be run with `npm test`.

### Live Integration Testing

For true end-to-end testing, the plugin must be tested within a running instance of Obsidian. A live test script is provided to verify that all commands work correctly and that files are modified as expected.

**To run the live integration test:**

1.  Ensure your test vault is set up by running:
    ```bash
    npm run setup:dev
    ```
2.  In your test vault, go to `Settings > Community Plugins` and ensure the **"Multi Properties"** plugin is **enabled**.
3.  Open the command palette (`Ctrl/Cmd+P`).
4.  Run the command: **"Multi-Properties: Run Live Integration Test (DEV)"**.
5.  Open the developer console (`Ctrl+Shift+I` or `Cmd+Option+I`) and click the **"Console"** tab to view the test results.

## Manual Testing Guide

This guide provides steps for manually testing the "Multi-Properties" plugin in a live Obsidian environment. This is crucial for verifying functionality that is not covered by automated tests, such as UI interactions and file modifications.

### Prerequisites

1.  Ensure you have a dedicated test vault.
2.  Make sure the `OBSIDIAN_TEST_VAULT_PATH` environment variable is set correctly to the path of your test vault.
3.  Run the full test environment setup using `npm run setup:test`.
4.  **Enable the Plugin:** In your test vault, go to `Settings > Community Plugins`, find "Multi Properties", and toggle it on.
5.  The `setup:test` script will automatically provide you with a `test-note.md` file to test against.

### Testing Scenarios

#### 1. Command Palette Operations

1.  Open your test vault and open the `test-note.md` file.
2.  Open the command palette (Ctrl/Cmd + P).

##### Scenarios to test:

-   **Add properties to current note:**
    -   Run the command "Multi-Properties: Add props to current note".
    -   Add a property and verify it is saved correctly in `test-note.md`.
-   **Remove properties from current note:**
    -   Run the command "Multi-Properties: Remove props from current note".
    -   Remove a property and verify it is removed from `test-note.md`.

#### 2. Window-Specific Operations

These commands operate on all the files open in the current window.

1.  Open several notes (e.g., `Note-01.md`, `Note-02.md`, `Note-03.md`) in a split-pane layout.
2.  Open the command palette (Ctrl/Cmd + P).

##### Scenarios to test:

-   **Add properties to open tabs:**
    -   Run the command "Multi-Properties: Add props to open tabs".
    -   Add properties and verify they are saved correctly in **all** open notes.
-   **Remove properties from open tabs:**
    -   Run the command "Multi-Properties: Remove props from open tabs".
    -   Remove properties and verify they are removed from **all** open notes.

#### 3. Context Menu Operations

These actions are performed by right-clicking in the File Explorer or Search panes.

##### Scenarios to test:

-   **Folder Operations:**
    1.  In the File Explorer, right-click on the `test-notes` folder.
    2.  Select "Add props to folder's notes".
    3.  Add a property and verify it is added to all notes within the `test-notes` folder.
    4.  Right-click the folder again, select "Remove props from folder's notes", and verify the property is removed from all notes.
-   **Multi-File Selection:**
    1.  In the File Explorer, `Ctrl/Cmd+Click` to select several notes (e.g., `Note-04.md`, `Note-05.md`).
    2.  Right-click the selection and choose "Add props to selected files".
    3.  Add a property and verify it is added only to the selected notes.
    4.  Repeat the selection, choose "Remove props from selected files", and verify the property is removed.
-   **Search Results:**
    1.  Open the Search pane (Ctrl/Cmd + Shift + F).
    2.  Search for `content:"Test Note"`.
    3.  In the search results pane, click the "More options" menu (three dots) and select "Add props to search results".
    4.  Add a property and verify it is added to all notes in the search results.
    5.  Repeat the search and use the menu to remove the property, verifying it was removed.

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
