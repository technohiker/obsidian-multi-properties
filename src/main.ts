import { Menu, Notice, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";
import { PropModal } from "./AddPropModal";
import { MultiPropSettings, SettingTab } from "./SettingTab";
import { RemoveModal } from "./RemoveModal";

const defaultSettings = {
	overwrite: false,
	recursive: true,
};

export interface NewPropData {
	type: string;
	data: string | string[];
	overwrite: boolean;
}

export default class MultiPropPlugin extends Plugin {
	settings: MultiPropSettings;
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));

		/** Add menu item on folder right-click to add properties to all notes in folder.
		 * PropModal returns Props on submit, which is then passed to searchThroughFolders via callback.
		 */
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setIcon("tag")
							.setTitle("Add props to folder's notes")
							.onClick(() =>
								new PropModal(this.app, (props) => {
									this.searchThroughFolders(
										file,
										this.addPropertiesCallback(props)
									);
								}).open()
							);
					});
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setIcon("tag")
							.setTitle("Remove props from folder's notes")
							.onClick(() => {
								new RemoveModal(this.app, (props) => {
									this.searchThroughFolders(
										file,
										this.removePropertiesCallback(props)
									);
								}).open();
							});
					});
				}
			})
		);

		/** Add menu item on multi-file right-click to add properties to all notes in selection.
		 * PropModal returns Props on submit, which is then passed to searchThroughFiles via callback.
		 */
		this.registerEvent(
			this.app.workspace.on("files-menu", (menu, files) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Add props to selected files")
						.onClick(() =>
							new PropModal(this.app, (props) => {
								this.searchThroughFiles(
									files,
									this.addPropertiesCallback(props)
								);
							}).open()
						);
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("files-menu", (menu, files) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Remove props from selected files")
						.onClick(() =>
							new RemoveModal(this.app, (props) => {
								this.searchThroughFiles(
									files,
									this.addPropertiesCallback(props)
								);
							}).open()
						);
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("search:results-menu", (menu: Menu, leaf: any) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Add props to search results")
						.onClick(() => {
							let files: any[] = [];
							leaf.dom.vChildren.children.forEach((e: any) => {
								files.push(e.file);
							});
							if (!files.length) {
								new Notice("No files to add properties to.", 4000);
								return;
							}
							new PropModal(this.app, (props) => {
								this.searchThroughFiles(
									files,
									this.addPropertiesCallback(props)
								);
							}).open();
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("search:results-menu", (menu: Menu, leaf: any) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Remove props from search results")
						.onClick(() => {
							let files: any[] = [];
							leaf.dom.vChildren.children.forEach((e: any) => {
								files.push(e.file);
							});
							if (!files.length) {
								new Notice("No files to remove properties from.", 4000);
								return;
							}
							new RemoveModal(this.app, (props) => {
								this.searchThroughFiles(
									files,
									this.addPropertiesCallback(props)
								);
							}).open();
						});
				});
			})
		);
	}

	/** Add properties from a Map to a note.
	 */
	addProperties(
		file: TFile,
		props: Map<string, NewPropData>,
		overwrite: boolean
	) {
		let propCache = this.app.metadataCache.getAllPropertyInfos();
		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			for (const [key, value] of props) {
				if (!frontmatter[key] || overwrite) {
					frontmatter[key] = value.data;
					continue;
				}

				let type1 = value.type;
				let type2 = propCache[key.toLowerCase()].type;

				if (!canBeAppended(type1, type2)) {
					frontmatter[key] = value.data;
					continue;
				} else {
					let arr = mergeIntoArrays(frontmatter[key], value.data);
					frontmatter[key] = arr;
					continue;
				}
			}
		});
	}

	/**
	 * Callback function to run addProperties inside iterative functions.
	 */
	addPropertiesCallback(props: any) {
		return (file: TFile) => {
			this.addProperties(file, props, this.settings.overwrite);
		};
	}

	removeProperties(file: TFile, props: string[]) {}

	removePropertiesCallback(props: any) {
		return (file: TFile) => {
			this.removeProperties(file, props);
		};
	}

	getPropertiesCallback(file: TFile) {}

	getProperties(file: TFile) {}

	/** Iterates through all files in a folder and runs callback on each. */
	searchThroughFolders(folder: TFolder, callback: (file: TFile) => void) {
		for (let obj of folder.children) {
			if (obj instanceof TFolder) {
				if (this.settings.recursive) {
					this.searchThroughFolders(obj, callback);
				}
			}
			if (obj instanceof TFile && obj.extension === "md") {
				callback(obj);
			}
		}
	}

	/** Iterates through selection of files and runs a given callback function on that file. */
	searchThroughFiles(arr: TAbstractFile[], callback: (file: TFile) => void) {
		for (let el of arr) {
			if (el instanceof TFile && el.extension === "md") {
				callback(el);
			}
		}
	}
	async loadSettings() {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

/** Check if two types can be appended to each other. */
function canBeAppended(str1: string, str2: string) {
	let arr = ["number", "date", "datetime", "checkbox"]; //These values should not be appended.
	if (arr.includes(str1) || arr.includes(str2)) return false;
	return true;
}

/** Convert strings and arrays into single array. */
function mergeIntoArrays(...args: (string | string[])[]): string[] {
	const arrays = args.map((arg) => (Array.isArray(arg) ? arg : [arg]));

	// Flatten the array
	const flattened = arrays.flat();

	// Remove duplicates using Set and spread it into an array
	const unique = [...new Set(flattened)];

	return unique;
}
