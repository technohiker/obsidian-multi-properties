# How to Manually Test the Multi-Tab Plugin

This note provides a step-by-step guide for manually testing the core features of the Multi-Tab plugin.

## Setup

1.  **Open the Notes:** Open all 10 notes (Note-01 through Note-10) in this vault. You can open them in separate tabs or split panes.
2.  **Arrange Your Workspace:** It's helpful to have several tabs visible at once to see the effects of your actions.

## Testing Scenarios

Follow these scenarios to test each command.

### Scenario 1: Add a New Property

1.  **Select Tabs:**
    -   Hold `Ctrl` (or `Cmd` on macOS) and click on the tabs for **Note-01**, **Note-03**, and **Note-07**.
2.  **Run Command:**
    -   Open the Command Palette (`Ctrl+P` or `Cmd+P`).
    -   Search for and select the command: `Multi Tab: Add Property to Selected Tabs`.
3.  **Enter Property:**
    -   For "Property Name", type `tested-by`.
    -   For "Property Value", type your name.
    -   Click "Add".
4.  **Verify:**
    -   Check the frontmatter of **Note-01**, **Note-03**, and **Note-07**. They should all now have the `tested-by` property with your name.

### Scenario 2: Remove an Existing Property

1.  **Select Tabs:**
    -   Hold `Ctrl` (or `Cmd`) and click on the tabs for **Note-01**, **Note-02**, and **Note-04**.
2.  **Run Command:**
    -   Open the Command Palette.
    -   Search for and select the command: `Multi Tab: Remove Property from Selected Tabs`.
3.  **Enter Property Name:**
    -   For "Property Name", type `priority`.
    -   Click "Remove".
4.  **Verify:**
    -   Check the frontmatter of **Note-01**, **Note-02**, and **Note-04**. The `priority` property should be gone.

### Scenario 3: Add a New Tag

1.  **Select Tabs:**
    -   Hold `Ctrl` (or `Cmd`) and click on the tabs for **Note-05**, **Note-07**, and **Note-08**.
2.  **Run Command:**
    -   Open the Command Palette.
    -   Search for and select the command: `Multi Tab: Add Tag to Selected Tabs`.
3.  **Enter Tag Name:**
    -   For "Tag Name", type `new-test-tag`.
    -   Click "Add".
4.  **Verify:**
    -   Check the frontmatter of **Note-05**, **Note-07**, and **Note-08**. They should all now have `new-test-tag` in their `tags` list.

### Scenario 4: Remove an Existing Tag

1.  **Select Tabs:**
    -   Hold `Ctrl` (or `Cmd`) and click on the tabs for **Note-06** and **Note-10**.
2.  **Run Command:**
    -   Open the Command Palette.
    -   Search for and select the command: `Multi Tab: Remove Tag from Selected Tabs`.
3.  **Enter Tag Name:**
    -   For "Tag Name", type `needs-review`.
    -   Click "Remove".
4.  **Verify:**
    -   Check the frontmatter of **Note-06** and **Note-10**. The `needs-review` tag should be gone from both.

### Scenario 5: Rename an Existing Tag

1.  **Select Tabs:**
    -   Use **Shift+Click** to select all tabs from **Note-01** to **Note-10**.
2.  **Run Command:**
    -   Open the Command Palette.
    -   Search for and select the command: `Multi Tab: Rename Tag in Selected Tabs`.
3.  **Enter Tag Names:**
    -   For "Old Tag Name", type `project-a`.
    -   For "New Tag Name", type `project-alpha`.
    -   Click "Rename".
4.  **Verify:**
    -   Check the frontmatter of **Note-01**, **Note-02**, and **Note-09**. The `project-a` tag should be replaced with `project-alpha`.
