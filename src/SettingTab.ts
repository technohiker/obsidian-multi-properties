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
			.setName("Overwrite existing properties.")
			.setDesc(
				"When adding a property with a name that already exists, overwrite it with the new value.  If turned off, "
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.override);
				toggle.onChange(async (value) => {
					this.plugin.settings.override = value;
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
	override: boolean;
	recursive: boolean;
}
