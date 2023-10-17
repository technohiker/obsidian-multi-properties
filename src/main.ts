import {
	App,
	Plugin,
	TAbstractFile,
	TFile,
	TFolder,
	getIcon,
	getIconIds,
} from "obsidian";
import { TagModal } from "./TagModal";
import { MultiPropSettings } from "./SettingTab";

const defaultSettings = {
	override: true,
};

export default class MultiTagPlugin extends Plugin {
	settings: MultiPropSettings;
	async onload() {
		//Add menu item for multi-tag functionality.  Set as Event to automatically be unloaded when needed.
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {
				const curLeaf = this.app.workspace.getMostRecentLeaf();
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setIcon("tag")
							.setTitle("Tag folder's files")
							.onClick(() =>
								new TagModal(this.app, file, searchThroughFolders).open()
							);
					});
				}
			})
		);
		this.registerEvent(
			this.app.workspace.on("files-menu", (menu, file, source) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Tag selected files")
						.onClick(() => new TagModal(this.app, file, FilesOrFolders).open());
				});
			})
		);
	}
	async loadSettings() {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

let customProps: Record<string, any> = {
	tags: ["new-tag-1", "new-tag-2"],
	number: 9001,
	testProp3: new Date(),
	rht: true,
	aliases: ["alias", "alias"],
	testProp: "1992-02-12T03:03", //If string is typed in this specific format, it will be read as datetime.
	testProp2: "09-05-2023",
};

function addProperties(
	props: Map<string, any>,
	overwrite: boolean,
	frontmatter: any
) {
	for (const [key, value] of props) {
		console.log({ key });
		if (!frontmatter[key]) {
			console.log("Adding key!");
			frontmatter[key] = props.get(key); //Works!
		} else {
			//Special case for tags.  ...actually, should this be done with any array?  It should!  TODO
			if (Array.isArray(props.get(key))) {
				console.log("Adding to list!");

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
				console.log("Type didn't match.");
				//throw new Error(`Types do not match for property ${key}.  Expected ${typeof frontmatter[key]} but got ${typeof props.get(key)}.`);
				continue;
			}
		}
	}
	console.log({ props });
	console.log({ frontmatter });
}

function FilesOrFolders(
	app: App,
	arr: (TFile | TFolder)[],
	customProps: Map<string, any>
) {
	for (let el of arr) {
		if (el instanceof TFile && el.extension === "md") {
			app.fileManager.processFrontMatter(el, (frontmatter) => {
				addProperties(customProps, true, frontmatter);
			});
		}
	}
}
/** Get all files belonging to a folder and print their file names. */
function searchThroughFolders(
	app: App,
	obj: TFolder,
	customProps: Map<string, any>
) {
	for (let child of obj.children) {
		if (child instanceof TFolder) {
			searchThroughFolders(app, child, customProps);
		}
		if (child instanceof TFile && child.extension === "md") {
			app.fileManager.processFrontMatter(child, (frontmatter) => {
				addProperties(customProps, true, frontmatter);
			});
		}
	}
}
