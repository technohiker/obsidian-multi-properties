# Multi-Properties

When installed, right-clicking on a folder will bring up an optin to add Properties to all notes within a folder. Upon clicking this, a form will pop up asking you to add your Props. You may add your Props, and they will be added to all notes in the folder.

You can also select multiple notes with Shift+Mouse, and right-click the selection to get the same effect.

# Installation:

This project is currently being submitted as an Obsidian community plugin that can be installed directly in the app. Once available, go to Settings->Community Plugins->Browser, and search the name `Multi Props`.

If you wish to install it manually,

1. Download the latest release.
2. Extract the folder within the release and add it to `[yourVault]/.obsidian/plugins/`.

## Ideas for Features:

- [x] Toggle that lets user choose whether adding another value to a prop name that already exists will either overwrite the property, or append to it.
- [ ] Would like to add tests for this plugin, but I'm not sure how to handle it for a plugin that writes directly to notes.

## Known Issues:

- [ ] There are no safeguards for inputting invalid tags. If a tag contains an invalid character(comma, question mark, etc.), it will be added to the note, but Obsidian will not be able to recognize it.
- [ ] Error Handling is currently non-existent. If a prop is not added correctly for whatever reason, you will not be notified of this.
