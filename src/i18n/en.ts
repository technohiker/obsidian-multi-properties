// English translations
export default {
  // Commands
  addPropsToCurrentNote: "Add props to current note",
  removePropsFromCurrentNote: "Remove props from current note",
  addPropsToTabGroup: "Add props to tabs in active tab group",
  removePropsFromTabGroup: "Remove props from tabs in active tab group",

  // Menu items
  addPropsToFile: "Add props to file.",
  addPropsToFolder: "Add props to folder.",
  removePropsFromFile: "Remove props from file.",
  removePropsFromFolder: "Remove props from folder.",
  addPropsFromAllTabs: "Add props from all tabs",
  removePropsFromAllTabs: "Remove props from all tabs",
  addPropsToSelectedFiles: "Add props to selected files",
  removePropsFromSelectedFiles: "Remove props from selected files",
  addPropsToSearchResults: "Add props to search results",
  removePropsFromSearchResults: "Remove props from search results",

  // Notices
  noActiveFileToAdd: "No active file to add properties to.",
  noActiveFileToRemove: "No active file to remove properties from.",
  noOpenTabsToAdd: "No open tabs in the active tab group to add properties to.",
  noOpenTabsToRemove: "No open tabs in the active tab group to remove properties from.",
  noFilesToAdd: "No files to add properties to.",
  noFilesToRemove: "No files to remove properties from.",
  noPropertiesToRemove: "No properties to remove",
  notValidPropsTemplate: "Not a valid Props template.",
  checkDefaultPropsPath: "Check if you entered a valid path in the Default Props File setting.",
  delimiterMustBeSingleChar: "Delimiter must be a single character.",

  // Settings
  settingsTitle: "Multi Properties Settings",
  alterPropName: "How to alter existing properties.",
  alterPropDesc: "Determine what to do when a property with the same name already exists in a file. Note that incompatible types cannot be appended (adding a number to a date).",
  overwriteProp: "Overwrite prop",
  appendToProp: "Append to prop",
  ignoreProp: "Ignore prop",
  recursiveName: "Recursive Iteration",
  recursiveDesc: "When toggled on, while looping through all files in a folder, you will also loop through any sub-folders.",
  listDelimiterName: "List Delimiter",
  listDelimiterDesc: "Set delimiter to use when creating a list. Commas(,) are used by default.",
  defaultPropsFileName: "Default Props File",
  defaultPropsFileDesc: "Select a file with properties that you want to load into the Multi Properties form by default. Type in the full path of the desired file (ex. Templates/PropFile 1).",

  // AddPropForm
  selectFromExistingOrCreate: "Select from existing properties or create new ones:",
  typePropertyNameAndValue: "Type in a property name, then value. Use the dropbox to choose what type of data you wish to store.",
  makeListPropertyNote: "If you want to make a List property, use the Text data type and separate each value with a \"{delimiter}\".",
  addTagsNote: "If you want to add Tags, use the name \"tags\".",
  howToAlterPropsLabel: "How to alter props that already exist on notes.",
  ignoreOption: "Ignore the prop entirely.",
  overwriteOption: "Overwrite new value over prop.",
  appendOption: "Append new value to prop.",
  addButton: "Add",
  submitButton: "Submit",
  duplicateNamesError: "Duplicate property names are not allowed.",
  errorLabel: "ERROR",

  // RemovePropForm
  selectPropertiesToRemove: "Select the properties you wish to remove from the file selection.",
  confirmButton: "Confirm",
  checkAllButton: "Check All",
  uncheckAllButton: "Uncheck All",
  selectAtLeastOneError: "Please select at least one property to remove.",

  // AddConfirmForm
  ignoreMsg: "Any of these text props on existing notes will not be affected.",
  appendMsg: "NOTE: Any pre-existing text props will have their values be appended to.",
  overwriteMsg: "WARNING: Any pre-existing text props will have their values overwritten.",
  followingPropsWillBeAdded: "The following props will be added:",
  areYouSure: "Are you sure you wish to proceed?",
  cancelButton: "Cancel",

  // Status bar
  addedPropsTo: "Added props to {count}/{total} files",
  removedPropsFrom: "Removed props from {count}/{total} files",

  // Common
  pluginName: "Multi Properties",
  addPropertiesTitle: "Add Properties",
  removePropertiesTitle: "Remove Properties",
  followingPropertiesWillBeRemoved: "The following {word} will be removed:",
  property: "property",
  properties: "properties",
  deleteButton: "Delete",
  pleaseCheckAtLeastOne: "Please check at least one property to remove."
};
