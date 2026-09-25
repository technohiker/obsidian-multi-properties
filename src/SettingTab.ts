import {
  PluginSettingTab,
  App,
  Setting,
  Notice,
  type SettingDefinitionItem,
} from "obsidian";

import MultiPropPlugin from "./main";

export class SettingTab extends PluginSettingTab {
  plugin: MultiPropPlugin;

  constructor(app: App, plugin: MultiPropPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  //<1.13.0 Obsidian
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

    new Setting(containerEl)
      .setName("Autocomplete Prop Names")
      .setDesc(
        "All existing props will appear as suggestions when typing in a prop name."
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.autocomplete);
        toggle.onChange(async (value) => {
          this.plugin.settings.autocomplete = value;
          await this.plugin.saveSettings();
        });
      });
  }

  // >=1.13.0, required for Obsidian's native Settings Search to work.
  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        name: "How to alter existing properties",
        desc: "Determine what to do when a property with the same name already exists in a file.  Note that incompatible types cannot be appended.(adding a number to a date",
        control: {
          type: "dropdown",
          key: "alterProp",
          defaultValue: "ignore",
          options: {
            overwrite: "Overwrite to Prop",
            append: "Append to Prop",
            ignore: "Ignore prop",
          },
        },
      },
      {
        name: "Recursive Iteration",
        desc: "When toggled on, while looping through all files in a folder, you will also loop through any sub-folders.",
        control: {
          type: "toggle",
          key: "recursive",
          defaultValue: false,
        },
      },
      {
        name: "List Delimiter",
        desc: "Set delimiter to use when creating a list.  Commas(,) are used by default.",
        control: {
          type: "text",
          key: "delimiter",
          placeholder: ",",
          validate: (value: string) =>
            value.length >= 2
              ? "Delimiter must be a single character."
              : undefined,
        },
      },
      {
        name: "Default Props File",
        desc: "Select a file with properties that you want to load into the Multi Properties form by default.  Type in the full path of the desired file.(ex. Templates/PropFile 1)",
        control: {
          type: "file",
          key: "defaultPropPath",
        },
      },
      {
        name: "Autocomplete Prop Name",
        desc: "All existing props will appear as suggestions when typing in a prop name.",
        control: {
          type: "toggle",
          key: "autocomplete",
          defaultValue: false,
        },
      },
    ];
  }
}
export interface MultiPropSettings {
  alterProp: "overwrite" | "append" | "ignore";
  recursive: boolean;
  delimiter: string;
  defaultPropPath: string;
  autocomplete: boolean;
}
