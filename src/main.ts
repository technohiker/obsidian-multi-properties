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
	aliases: ["alias", "alias"],
	testProp: "1992-02-12T03:03", //If string is typed in this specific format, it will be read as datetime.
	testProp2: "09-05-2023",
};

function createProps(e: SubmitEvent) {}

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
			//Check if object type and frontmatter type match.  If not, throw error.
			if (typeof frontmatter[key] !== typeof props.get(key)) {
				console.log("Type didn't match.");
				//throw new Error(`Types do not match for property ${key}.  Expected ${typeof frontmatter[key]} but got ${typeof props.get(key)}.`);
				continue;
			}
			//Special case for tags.  ...actually, should this be done with any array?  It should!  TODO
			if (key === "tags" && Array.isArray(props.get(key))) {
				console.log("Adding tags!");

				let arrValue: string[] = props.get(key);
				let currTags = frontmatter.tags ?? [];

				let set = new Set([...currTags, ...arrValue]);
				frontmatter.tags = [...set];

				continue;
			}
			if (Array.isArray(frontmatter[key])) {
				frontmatter[key].push(props.get(key));
			} else if (overwrite) {
				frontmatter[key] = props.get(key);
			}
		}
	}
	console.log({ props });
	console.log({ frontmatter });
}

function appendToFile(file: TFile, string: string) {
	this.app.vault.append(file, `\n${string}`);
}

function FilesOrFolders(
	app: App,
	arr: (TFile | TFolder)[],
	customProps: Map<string, any>
) {
	for (let el of arr) {
		if (el instanceof TFile && el.extension === "md") {
			//appendToFile(el, string);
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
			//appendToFile(child, string);
			app.fileManager.processFrontMatter(child, (frontmatter) => {
				addProperties(customProps, true, frontmatter);
			});
		}
	}
}
