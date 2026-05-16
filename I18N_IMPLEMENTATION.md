# 多语言支持实现总结

## 已完成的工作

### 1. 创建 i18n 文件夹和翻译文件
- `src/i18n/en.ts` - 英文翻译
- `src/i18n/zh.ts` - 中文翻译
- `src/i18n/index.ts` - i18n 入口文件，包含语言检测和翻译获取功能

### 2. 修改主插件文件 (main.ts)
- 导入 i18n 模块
- 添加 `t` (翻译对象) 和 `currentLocale` 属性
- 添加 `initI18n()` 方法初始化多语言支持
- 替换所有硬编码文本为翻译键
- 传递翻译对象给模态框组件

### 3. 修改设置选项卡 (SettingTab.ts)
- 接收并使用翻译对象
- 替换所有设置界面文本为翻译键

### 4. 修改模态框组件
- `AddPropModal.ts` - 接收并传递翻译对象
- `AddConfirmModal.ts` - 接收并传递翻译对象
- `RemoveModal.ts` - 接收并传递翻译对象
- `RemoveConfirmModal.ts` - 接收并传递翻译对象

### 5. 修改 Svelte 组件
- `AddPropForm.svelte` - 使用翻译对象，替换所有界面文本
- `RemovePropForm.svelte` - 使用翻译对象，替换所有界面文本
- `AddConfirmForm.svelte` - 使用翻译对象，替换所有界面文本
- `RemoveConfirmForm.svelte` - 使用翻译对象，替换所有界面文本

## 功能特性

1. **自动语言检测**
   - 优先使用 Obsidian 的语言设置
   - 其次使用浏览器语言
   - 默认回退到英文

2. **支持的语言**
   - 英语 (en, en-US, en-GB, en-CA, en-AU)
   - 中文 (zh, zh-CN, zh-TW, zh-HK, zh-SG)

3. **格式化支持**
   - 支持带参数的翻译字符串
   - 例如：`"Added props to {count}/{total} files"`

## 使用方式

插件会自动根据用户的语言设置显示相应的语言，无需额外配置。

## 翻译文件结构

翻译文件包含以下类别：
- Commands - 命令名称
- Menu items - 菜单项
- Notices - 通知消息
- Settings - 设置界面
- AddPropForm - 添加属性表单
- RemovePropForm - 移除属性表单
- AddConfirmForm - 添加确认表单
- RemoveConfirmForm - 移除确认表单
- Status bar - 状态栏
- Common - 通用文本
