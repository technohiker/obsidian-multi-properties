# Todos
- [x] On AddPropForm, examine flex-grow.  The name field shrinks to the minimum amount on Android.  How to prevent this?  Used width: auto.
- [ ] When pushing new update, do it in `{id}-{v}.zip` format.
- [x] Change empty string in prop value to null value.  Currently commented out on AddPropForm 119.  Test it.
- [ ] Load a template file into the GUI.
- [x] No multi-selection for bookmarks.(when event is available)

# Patch Notes:
- Props with no value typed in will leave an empty value on the note file, instead of an empty string as it used to.("")
- `name` Prop field no longer scales down with screen size.  Now the form will properly scroll when overflowing.  Addresses an issue where the `name` field could not be selected on mobile.
- Fixed issue where some Props in subfolders were not being acquired when attempting to remove Props from a folder.
- Props that appear on Remove Prop list are now alphabetized.

# Multi-Properties

Obsidian.md's Properties are very useful for adding miscellaneous information on notes, but there is currently no functionality for adding properties to multiple files at once.  To make things more convenient for myself and others, I decided to make a plugin to introduce that functionality.

## Accessing the Forms:
There are 3 kinds of note selections you can choose to add multiple properties at once.
  1. All notes in a folder.  Right-click a folder.
  2. A selection of notes in the File Explorer.  Select multiple notes with Shift+Mouse Click, then right-click the selection.
  3. All notes in a Search result.  Click on the `# results` text below the Search bar, and your Property options will pop up.



## Adding & Editing Properties:
Right-click on one of the above selections to bring up an option to add Properties to all notes within a folder. Upon clicking this, a form will pop up asking you to input your Properties.  Once you type in the Properties and desired values, submit the form and they will be added to all notes in the selection.

If you type in the name of an existing Property, your value will either override the current value of that Property on all of the notes in the selection, or the new value will be appended onto the existing value.  Whichever one occurs will depend on your settings, which can be changed directly from the form.  Note that this will only work with text-based Properties.

## Removing Properties:
Right-clicking a selection will also pull up an option to remove selected Properties from a group of notes. The property selected will be permanently deleted from all notes you initially targeted, so use caution.  Back up your files if you want to be on the safe side.

## Demo:

![Multi Properties Demo 1 0 0](https://github.com/fez-github/obsidian-multi-properties/assets/75589254/8483e98d-cc4f-4770-a0bf-7a5da2cab93d)


## Installation:

This project is available as an Obsidian community plugin that can be installed directly in the app.  Go to Settings->Community Plugins->Browser, and search the name `Multi Properties`.

If you wish to install it outside of Obsidian's Community Plugins menu, follow these steps.

1. Download the latest release.
2. Extract the folder within the zip file in the current release, and add it to `<yourVault>/.obsidian/plugins/`.
