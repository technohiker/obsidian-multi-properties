import { PluginSettingTab, App, Setting } from "obsidian";

import MultiTagPlugin from "./main";

export class SettingTab extends PluginSettingTab {
	plugin: MultiTagPlugin;

	constructor(app: App, plugin: MultiTagPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		let { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Overwrite existing properties.")
			.setDesc("When adding a property with a name that already exists, overwrite it with the new value.  If turned off, ")
			.addToggle((toggle) => {
				toggle.onChange(async (value) => {
					this.plugin.settings.override = value;
					await this.plugin.saveSettings();
				})
			});
	}
}

export interface MultiPropSettings {
	override: boolean
}