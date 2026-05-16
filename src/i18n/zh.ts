// 中文翻译
export default {
  // Commands
  addPropsToCurrentNote: "向当前笔记添加属性",
  removePropsFromCurrentNote: "从当前笔记移除属性",
  addPropsToTabGroup: "向活动标签组中的标签添加属性",
  removePropsFromTabGroup: "从活动标签组中的标签移除属性",

  // Menu items
  addPropsToFile: "向文件添加属性",
  addPropsToFolder: "向文件夹添加属性",
  removePropsFromFile: "从文件移除属性",
  removePropsFromFolder: "从文件夹移除属性",
  addPropsFromAllTabs: "从所有标签添加属性",
  removePropsFromAllTabs: "从所有标签移除属性",
  addPropsToSelectedFiles: "向选中的文件添加属性",
  removePropsFromSelectedFiles: "从选中的文件移除属性",
  addPropsToSearchResults: "向搜索结果添加属性",
  removePropsFromSearchResults: "从搜索结果移除属性",

  // Notices
  noActiveFileToAdd: "没有活动文件可添加属性。",
  noActiveFileToRemove: "没有活动文件可移除属性。",
  noOpenTabsToAdd: "活动标签组中没有打开的标签可添加属性。",
  noOpenTabsToRemove: "活动标签组中没有打开的标签可移除属性。",
  noFilesToAdd: "没有文件可添加属性。",
  noFilesToRemove: "没有文件可移除属性。",
  noPropertiesToRemove: "没有可移除的属性",
  notValidPropsTemplate: "不是有效的属性模板。",
  checkDefaultPropsPath: "请检查您在默认属性文件设置中输入的路径是否有效。",
  delimiterMustBeSingleChar: "分隔符必须是单个字符。",

  // Settings
  settingsTitle: "Multi Properties 设置",
  alterPropName: "如何处理已存在的属性？",
  alterPropDesc: "确定当文件中已存在同名属性时应如何处理。注意，不兼容的类型无法追加（如向日期添加数字）。",
  overwriteProp: "覆盖属性",
  appendToProp: "追加到属性",
  ignoreProp: "忽略属性",
  recursiveName: "递归迭代",
  recursiveDesc: "启用后，在遍历文件夹中的所有文件时，也将遍历任何子文件夹。",
  listDelimiterName: "列表分隔符",
  listDelimiterDesc: "设置创建列表时使用的分隔符，默认使用逗号(,)。",
  defaultPropsFileName: "默认属性文件",
  defaultPropsFileDesc: "选择一个包含属性的文件，您希望默认加载到 Multi Properties 表单中。输入所需文件的完整路径（例如 Templates/PropFile 1）。",

  // AddPropForm
  selectFromExistingOrCreate: "从现有属性中选择或创建新属性：",
  typePropertyNameAndValue: "输入属性名称，然后输入值。使用下拉框选择您要存储的数据类型。",
  makeListPropertyNote: "如果要创建列表属性，请使用文本数据类型，并用 \"{delimiter}\" 分隔每个值。",
  addTagsNote: "如果要添加标签，请使用名称 \"tags\"。",
  howToAlterPropsLabel: "如何处理笔记中已存在的属性。",
  ignoreOption: "完全忽略该属性。",
  overwriteOption: "用新值覆盖属性。",
  appendOption: "向属性追加新值。",
  addButton: "添加",
  submitButton: "提交",
  duplicateNamesError: "不允许重复的属性名称。",
  errorLabel: "错误",

  // RemovePropForm
  selectPropertiesToRemove: "选择您希望从文件选择中移除的属性。",
  confirmButton: "确认",
  checkAllButton: "全选",
  uncheckAllButton: "取消全选",
  selectAtLeastOneError: "请至少选择一个要移除的属性。",

  // AddConfirmForm
  ignoreMsg: "现有笔记上的这些文本属性不会受到影响。",
  appendMsg: "注意：任何已存在的文本属性的值将被追加。",
  overwriteMsg: "警告：任何已存在的文本属性的值将被覆盖。",
  followingPropsWillBeAdded: "将添加以下属性：",
  areYouSure: "您确定要继续吗？",
  cancelButton: "取消",

  // Status bar
  addedPropsTo: "已向 {count}/{total} 个文件添加属性",
  removedPropsFrom: "已从 {count}/{total} 个文件移除属性",

  // Common
  pluginName: "Multi Properties",
  addPropertiesTitle: "添加属性",
  removePropertiesTitle: "移除属性",
  followingPropertiesWillBeRemoved: "将移除以下{word}：",
  property: "个属性",
  properties: "个属性",
  deleteButton: "删除",
  pleaseCheckAtLeastOne: "请至少选择一个要移除的属性。"
};
