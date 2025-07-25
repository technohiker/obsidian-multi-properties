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

Now, run the initialization script. This command will copy the necessary test notes from the `test-notes` directory into your configured test vault and then attempt to open the vault in Obsidian.

```bash
npm run initialize-test-vault
```

### Step 4: Build and Test

1.  **Build the Plugin:** Compile the TypeScript source into `main.js`.
    ```bash
    npm run build
    ```
    *(Use `npm run dev` for automatic rebuilding during development.)*

2.  **Run Tests:** Execute the automated test suite. This command will first install the latest build of the plugin into your test vault and then run the tests.
    ```bash
    npm test
    ```

### Personal Vault Scripts (Optional)

If you want to install the plugin in your primary, day-to-day vault for manual testing, you must set the `OBSIDIAN_PERSONAL_VAULT_PATH` environment variable.

-   `npm run install-plugin-personal`: Copies the plugin into your personal vault.
-   `npm run open-personal-vault`: Opens your personal vault in Obsidian.

## Installation

This plugin is available in the Obsidian community plugin store. You can install it directly from within the Obsidian app by going to `Settings > Community Plugins > Browse` and searching for "Multi Properties".

For manual installation:

1.  Download the latest release from the [releases page](https://github.com/fez-github/obsidian-multi-properties/releases).
2.  Extract the contents of the zip file.
3.  Copy the extracted folder to your vault's plugin folder: `<your-vault>/.obsidian/plugins/`.
