import { PluginSettingTab, App, Setting } from "obsidian";

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
			.setName("Overwrite existing text.")
			.setDesc(
				"When adding a property with a name that already exists, the text will overwrite the prop's existing value.  If left disabled, the new value will be appended to the old as a List."
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.overwrite);
				toggle.onChange(async (value) => {
					this.plugin.settings.overwrite = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Recursive Iteration.")
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
	}
}

export interface MultiPropSettings {
	overwrite: boolean;
	recursive: boolean;
}
