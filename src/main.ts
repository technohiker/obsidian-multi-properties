import { Plugin, TAbstractFile, TFile, TFolder } from "obsidian";
import { PropModal } from "./PropModal";
import { MultiPropSettings, SettingTab } from "./SettingTab";

const defaultSettings = {
	override: true,
	recursive: true,
};

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
										this.propertiesCallback(props)
									);
								}).open()
							);
					});
				}
			})
		);

		/** Add menu item on multi-file right-click to add properties to all notes in selection.
		 * PropModal returns Props on submit, which is then passed to searchThroughFiles via callback.
		 */
		this.registerEvent(
			this.app.workspace.on("files-menu", (menu, file) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Add props to selected files")
						.onClick(() =>
							new PropModal(this.app, (props) => {
								this.searchThroughFiles(file, this.propertiesCallback(props));
							}).open()
						);
				});
			})
		);
	}

	addProperties(file: TFile, props: Map<string, any>, overwrite: boolean) {
		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			for (const [key, value] of props) {
				if (!frontmatter[key]) {
					frontmatter[key] = props.get(key); //Works!
				} else {
					//Special case for tags.
					if (Array.isArray(props.get(key))) {
						let arrValue = props.get(key);
						if (!Array.isArray(arrValue)) {
							arrValue = [arrValue];
						}

						let currTags = frontmatter.tags ?? [];

						let set = new Set([...currTags, ...arrValue]);
						frontmatter.tags = [...set];

						continue;
					} else if (Array.isArray(frontmatter[key])) {
						frontmatter[key].push(props.get(key));
					} else if (overwrite) {
						frontmatter[key] = props.get(key);
					}
					//Check if object type and frontmatter type match.  If not, throw error.
					else if (typeof frontmatter[key] !== typeof props.get(key)) {
						//console.log("Type didn't match.");
						//throw new Error(`Types do not match for property ${key}.  Expected ${typeof frontmatter[key]} but got ${typeof props.get(key)}.`);
						continue;
					}
				}
			}
		});
	}

	/**
	 * Callback function to run addProperties inside iterative functions.
	 */
	propertiesCallback(props: any) {
		return (file: TFile) => {
			this.addProperties(file, props, true);
		};
	}

	/** Iterates through all files in a folder and runs callback on each. */
	searchThroughFolders(folder: TFolder, callback: (file: TFile) => void) {
		for (let obj of folder.children) {
			if (obj instanceof TFolder) {
				//TODO: Check for whether recursion setting is on.
				console.log(this.settings);
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

// function FilesOrFolders(
// 	arr: (TFile | TFolder)[],
// 	callback: (file: TFile, ...args: any[]) => void
// ) {
// 	for (let el of arr) {
// 		if (el instanceof TFile && el.extension === "md") {
// 			callback(el);
// 		}
// 	}
// }
