import { Plugin, TAbstractFile, TFile, TFolder } from "obsidian";
import { PropModal } from "./PropModal";
import { MultiPropSettings, SettingTab } from "./SettingTab";

const defaultSettings = {
	overwrite: false,
	recursive: true,
};

export interface NewPropData{
	type: string,
	data: string | string[],
	overwrite: boolean
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

	/** Add properties from a Map to a note.
	 */
	addProperties(file: TFile, props: Map<string, NewPropData>, overwrite: boolean) {
		let propCache = this.app.metadataCache.getAllPropertyInfos();
		console.log({propCache})
		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			for(const [key,value] of props){
				console.log(key,value)
				console.log(frontmatter[key])
				if(!frontmatter[key] || overwrite){
					console.log("First check running.")
					 frontmatter[key] = value.data;
					 console.log({frontmatter})
					 continue;
				}

				let type1 = value.type;
				let type2 = propCache[key.toLowerCase()].type;

				if(!canBeAppended(type1,type2)){
					console.log("Second check running.")
					frontmatter[key] = value.data;
					continue;
				}
				else{
					console.log("Third check running.")
					let arr = mergeIntoArrays(frontmatter[key],value.data)
					console.log({arr})
					frontmatter[key] = arr
					console.log({frontmatter})
					continue;
				}

				if(canBeAppended(value.type,propCache[key.toLowerCase()].type)){
					console.log("Last check running.")
					let arr = mergeIntoArrays(frontmatter[key],value.data)
					console.log({arr})
					frontmatter[key] = arr
					console.log({frontmatter})
					continue;
				}
				console.log({frontmatter})
			}
		});
	}

	/**
	 * Callback function to run addProperties inside iterative functions.
	 */
	propertiesCallback(props: any) {
		return (file: TFile) => {
			this.addProperties(file, props,this.settings.overwrite);
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

function canBeAppended(str1: string, str2: string){
	console.log({str1,str2})
	let arr = ["number","date","datetime","checkbox"]  //These values should not be appended.
	if(arr.includes(str1) || arr.includes(str2))  return false
  return true
}

function mergeIntoArrays(...args: (string | string[])[]): string[] {
	// Convert all arguments into arrays
	const arrays = args.map(arg => Array.isArray(arg) ? arg : [arg]);
	
	// Flatten the array
	const flattened = arrays.flat();
	
	// Remove duplicates using Set and spread it into an array
	const unique = [...new Set(flattened)];
	
	return unique;
}