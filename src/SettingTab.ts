import { PluginSettingTab, App, Setting, Notice } from "obsidian";

import MultiPropPlugin from "./main";

export class SettingTab extends PluginSettingTab {
  plugin: MultiPropPlugin;

  constructor(app: App, plugin: MultiPropPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    let { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("How to alter existing properties.")
      .setDesc(
        "Determine what to do when a property with the same name already exists in a file.  Note that incompatible types cannot be appended.(adding a number to a date)"
      )
      .addDropdown((dropdown) => {
        dropdown
          .addOption("overwrite", "Overwrite prop")
          .addOption("append", "Append to prop")
          .addOption("ignore", "Ignore prop")
          .setValue(this.plugin.settings.alterProp)
          .onChange(async (value: "overwrite" | "append" | "ignore") => {
            this.plugin.settings.alterProp = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Recursive Iteration")
      .setDesc(
        "When toggled on, while looping through all files in a folder, you will also loop through any sub-folders."
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.recursive);
        toggle.onChange(async (value) => {
          this.plugin.settings.recursive = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("List Delimiter")
      .setDesc(
        "Set delimiter to use when creating a list.  Commas(,) are used by default."
      )
      .addText((text) => {
        text.setValue(this.plugin.settings.delimiter);
        text.onChange(async (value: MultiPropSettings["alterProp"]) => {
          if (value.length > 1) {
            text.setValue(value[0]);
            new Notice("Delimiter must be a single character.");
            return;
          }
          this.plugin.settings.delimiter = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Default Props File")
      .setDesc(
        "Select a file with properties that you want to load into the Multi Properties form by default.  Type in the full path of the desired file.(ex. Templates/PropFile 1)"
      )
      .addText((text) => {
        text.setValue(this.plugin.settings.defaultPropPath);
        text.onChange(async (value) => {
          this.plugin.settings.defaultPropPath = value;
          await this.plugin.saveSettings();
        });
      });
  }
}

export interface MultiPropSettings {
  alterProp: "overwrite" | "append" | "ignore";
  recursive: boolean;
  delimiter: string;
  defaultPropPath: string;
}
