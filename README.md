# Multi-Tag

When installed, right-clicking on a folder will bring up an option to add a tag to all notes within a folder. Upon clicking this, a message will pop up asking you to add a tag. You may add your tag, and it will be appended to each note in the folder. Once confirming, the tag(s) will be added to the bottom of each note in the folder.

You can also select multiple notes with Shift+Mouse, and right-click the selection to get the same efect.

# Installation:

This project is available as an Obsidian community plugin that can be installed directly in the app. Go to Settings->Community Plugins->Browser, and search the name `Multi Tag`.

If you wish to install it manually,

1. Download the latest release.
2. Extract the folder within the release and add it to `[yourVault]/.obsidian/plugins/`.

## Ideas for Features:

- [ ] Settings option for whether tag appears in YAML or bottom of file.

## Next Steps:

- [x] Update obsidian typing so "files-menu" is properly implemented.
- [ ] Clean form input so only a tag will be created. No extra text.
- [ ] Stylize form.

# Revise into Multi Add Property:

Goal: Instead of appending text to a note, interact with the frontmatter and add properties. Should be able to do this with every note.

- [ ] Create a class that interacts with frontmatter.

  - [ ] Error Handle: What if note already has that property? Obsidian's default behavior is to overwrite the old value.
    - Let user toggle whether they should override the old value or not?

- [ ] Create form that makes inputting properties easy.

### Form Tasks:

- [x] Realign focus when input div is deleted.
- [x] Create padding between each input div.
- [x] Make padding between label/input.
- [x] Clearly define border for input divs.
- [ ]

## Questions:

How does 'tags' work? In my note, the list of tags do not have any hashtags in front of them. If I go into the md file and manually add a hashtag, it does nothing.

- If I attempt that, the hashtag will eventually be removed.
- If I attempt to add a hashtag in Obsidian, it will be ignored. The hashtag is still recognized in the note, but the tag itself is now in quotes, including the hashtag.
- Tag field accepts both a Set, and an array of strings.
- If I merge a note in Obsidian, properties that are meant to only hold one value will be overwritten.

## Tests:

- A single prop of any type can be added.
- Multiple props of any type can be added.
- Overwrite should work properly.
- If adding a prop with the same name, then it should not overwrite.
- Works on all targeted notes.
- Lists are properly updated.
- Right-click action comes up on folder select.
- Right-click action comes up on multi-file select.
