import { App, Modal, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";
import { TagModal } from "./TagModal";

// interface CustomProperties {
// 	[key: string]: string | string[] | number | Date | boolean;
// }

export default class MultiTagPlugin extends Plugin {
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
}

let customProps: Record<string, any> = {
	tags: ["new-tag-1", "new-tag-2"],
	number: 9001,
	testProp3: new Date(),
	rht: true,
	alias: "alias",
	testProp: "1992-02-12T03:03", //If string is typed in this specific format, it will be read as datetime.
	testProp2: "09-05-2023",
};

function addProperties(
	props: Record<string, any>,
	overwrite: boolean,
	frontmatter: any
) {
	for (let key in props) {
		if (!frontmatter[key]) {
			frontmatter[key] = props[key]; //Works!
		} else {
			if (key === "tags" && Array.isArray(props[key])) {
				let arrValue: string[] = props[key];
				let currTags = frontmatter.tags ?? [];

				let set = new Set([...currTags, ...arrValue]);
				frontmatter.tags = [...set];

				continue;
			}
			if (Array.isArray(frontmatter[key])) {
				frontmatter[key].push(props[key]);
			} else if (overwrite) {
				frontmatter[key] = props[key];
			}
		}
	}
	console.log({ frontmatter });
}

function appendToFile(file: TFile, string: string) {
	this.app.vault.append(file, `\n${string}`);
}

function FilesOrFolders(app: App, arr: (TFile | TFolder)[], string: string) {
	for (let el of arr) {
		if (el instanceof TFile && el.extension === "md") {
			appendToFile(el, string);
		}
	}
}

/** Get all files belonging to a folder and print their file names. */
function searchThroughFolders(app: App, obj: TFolder, string: string) {
	for (let child of obj.children) {
		if (child instanceof TFolder) {
			searchThroughFolders(app, child, string);
		}
		if (child instanceof TFile && child.extension === "md") {
			//appendToFile(child, string);
			app.fileManager.processFrontMatter(child, (frontmatter) => {
				addProperties(customProps, true, frontmatter);
			});
		}
	}
}
