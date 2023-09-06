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

  - [ ] Create key/value fields. User enters a key, then a value. If the user has multiple values, such as an array of tags, then let them create multiple key/value fields. This process should be smooth.
  - [ ] User needs to have access to the data type as well. Let them pick from the following types.
    - [ ] Date
    - [ ] Datetime
    - [ ] String
    - [ ] Array of strings
    - [ ] Number
    - [ ] Boolean
    - [ ] Tags

## Questions:

How does 'tags' work? In my note, the list of tags do not have any hashtags in front of them. If I go into the md file and manually add a hashtag, it does nothing.

- If I attempt that, the hashtag will eventually be removed.
- If I attempt to add a hashtag in Obsidian, it will be ignored. The hashtag is still recognized in the note, but the tag itself is now in quotes, including the hashtag.
- Tag field accepts both a Set, and an array of strings.
- If I merge a note in Obsidian, properties that are meant to only hold one value will be overwritten.
