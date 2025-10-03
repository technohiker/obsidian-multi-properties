# Obsidian Multi-Properties Plugin

This plugin allows you to add, edit, or remove frontmatter properties from multiple notes at once, streamlining your workflow when managing metadata across your vault.

## Demo

![Multi Properties Demo 1 0 0](https://github.com/fez-github/obsidian-multi-properties/assets/75589254/8483e98d-cc4f-4770-a0bf-7a5da2cab93d)

## Features

You can act on multiple notes at once in several ways:

-   **Current Note:** Use a command to add or remove properties from the currently active note.
-   **Folders:** Right-click a folder in the File Explorer to affect all notes within it (and optionally, all sub-folders).
-   **File Selections:** Select multiple files using `Shift+Click` or `Ctrl/Cmd+Click`, then right-click the selection.
-   **Search Results:** After performing a search, right-click the search pane to modify all resulting notes.
-   **All Open Tabs in Active Tab Group:** Run a command to add or remove properties from all currently open tabs in the active tab group.

### Actions

-   **Add/Edit Properties:** A form will appear allowing you to input new properties and their values. If a property already exists on a note, you can choose to either overwrite its value or append to it (for text-based properties). Editing a property is achieved by adding a property with the same name and selecting the "overwrite" option.
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
git clone https://github.com/notuntoward/obsidian-multi-properties.git
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

#### 2. Tab Group-Specific Operations

These commands operate on all the files open in the current tab group.

1.  Open several notes (e.g., `Note-01.md`, `Note-02.md`, `Note-03.md`) in a split-pane layout.
2.  Open the command palette (Ctrl/Cmd + P).

##### Scenarios to test:

-   **Add properties to tabs in active tab group:**
    -   Run the command "Multi-Properties: Add props to tabs in active tab group".
    -   Add properties and verify they are saved correctly in **all** open notes in the active tab group.
-   **Remove properties from tabs in active tab group:**
    -   Run the command "Multi-Properties: Remove props from tabs in active tab group".
    -   Remove properties and verify they are removed from **all** open notes in the active tab group.

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

### All Available Commands

Here is a comprehensive list of all scripts available in `package.json`:

#### Development
*   `npm run dev`
    *   Runs a development server that watches for file changes and rebuilds the plugin automatically.
*   `npm run build:dev`
    *   Creates a development build of the plugin.

#### Building & Versioning
*   `npm run build`
    *   Creates a production-ready build of the plugin.
*   `npm run version`
    *   Bumps the plugin version in `manifest.json` and `versions.json` and stages the changes for commit.

#### Testing
*   `npm test`
    *   Runs the test suite using Vitest.
*   `npm run setup:test`
    *   Sets up the test environment by building the plugin, initializing a test vault, and installing the plugin into it.
*   `npm run initialize-test-vault`
    *   Initializes a test vault for Obsidian.
*   `npm run install:test`
    *   Installs the plugin into the test vault.
*   `npm run build-and-install:test`
    *   Builds the plugin and installs it into the test vault.

#### Personal/Manual Use
*   `npm run setup:dev`
    *   Initializes a test vault for development.
*   `npm run install:personal`
    *   Installs the plugin into a personal or development vault.
*   `npm run build-and-install:personal`
    *   Builds the plugin and installs it into a personal vault.
*   `npm run open-personal-vault`
    *   Opens the personal Obsidian vault.

## Installation

This project is available as an Obsidian community plugin that can be installed directly in the app. Go to Settings->Community Plugins->Browser, and search the name `Multi Properties`.

If you wish to install it outside of Obsidian's Community Plugins menu, follow these steps.

1. Download the latest release from https://github.com/technohiker/obsidian-multi-properties/.
2. Extract the folder within the zip file in the current release, and add it to `<yourVault>/.obsidian/plugins/`.