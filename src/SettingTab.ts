import { PluginSettingTab, App, Setting, Notice } from "obsidian";

import MultiPropPlugin from "./main";
import type en from "./i18n/en";

export class SettingTab extends PluginSettingTab {
  plugin: MultiPropPlugin;
  t: typeof en;

  constructor(app: App, plugin: MultiPropPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.t = plugin.t;
  }

  display() {
    let { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName(this.t.alterPropName)
      .setDesc(this.t.alterPropDesc)
      .addDropdown((dropdown) => {
        dropdown
          .addOption("overwrite", this.t.overwriteProp)
          .addOption("append", this.t.appendToProp)
          .addOption("ignore", this.t.ignoreProp)
          .setValue(this.plugin.settings.alterProp)
          .onChange(async (value: "overwrite" | "append" | "ignore") => {
            this.plugin.settings.alterProp = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(this.t.recursiveName)
      .setDesc(this.t.recursiveDesc)
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.recursive);
        toggle.onChange(async (value) => {
          this.plugin.settings.recursive = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.t.listDelimiterName)
      .setDesc(this.t.listDelimiterDesc)
      .addText((text) => {
        text.setValue(this.plugin.settings.delimiter);
        text.onChange(async (value: MultiPropSettings["alterProp"]) => {
          if (value.length > 1) {
            text.setValue(value[0]);
            new Notice(this.t.delimiterMustBeSingleChar);
            return;
          }
          this.plugin.settings.delimiter = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.t.defaultPropsFileName)
      .setDesc(this.t.defaultPropsFileDesc)
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
