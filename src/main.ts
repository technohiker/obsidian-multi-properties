import { App, Modal, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";

export default class MultiTagPlugin extends Plugin {
	async onload() {
		//Add menu item for multi-tag functionality.  Set as Event to automatically be unloaded when needed.
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setIcon("tag")
							.setTitle("Tag My Files")
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
						.setTitle("Tag All Files")
						.onClick(() => new TagModal(this.app, file, FilesOrFolders).open());
				});
			})
		);
	}
}

/** Get all files belonging to a folder and print their file names. */
function searchThroughFolders(obj: TFolder, string: string) {
	for (let child of obj.children) {
		if (child instanceof TFolder) {
			searchThroughFolders(child, string);
		}
		if (child instanceof TFile && child.extension === "md") {
			appendToFile(child, string);
		}
	}
}

function appendToFile(file: TFile, string: string) {
	this.app.vault.append(file, `\n${string}`);
}

function FilesOrFolders(arr: (TFile | TFolder)[], string: string) {
	for (let el of arr) {
		if (el instanceof TFile && el.extension === "md") {
			appendToFile(el, string);
		}
	}
}

class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	submission: (obj: any, string: string) => void;

	constructor(
		app: App,
		base: TFolder | TAbstractFile[],
		submission: (obj: any, string: string) => void
	) {
		super(app);

		//Removes potential spaces in file names.  Should I also remove capitalization?
		if (base instanceof TFolder) {
			this.default = `#${base.name.replace(" ", "-")}`;
		}

		this.base = base;
		this.submission = submission;
	}

	onSubmit(e: Event, input: string) {
		e.preventDefault();

		//Run code for adding text to all files.
		this.submission(this.base, input);
		this.close();
	}

	onOpen(): void {
		this.modalEl.addClass("modal");

		const { contentEl, titleEl } = this;

		//Create text.
		titleEl.createEl("h2", { text: "Please type in a tag." });
		titleEl.createEl("span", {
			text: "Whatever text is inputted will be appended to all files in this folder as text.  Place '#' signs to identify tags.",
		});

		//Create form object.
		contentEl.createEl("form", { cls: "modal-form" }, (formEl) => {
			let input = formEl.createEl("input", { value: this.default });

			formEl.createDiv("modal-button-container", (buttonEl) => {
				let btnSubmit = buttonEl.createEl("button", {
					text: "Submit",
					type: "submit",
					cls: "mod-cra",
				});

				let btnCancel = buttonEl.createEl("button", {
					text: "Cancel",
					type: "cancel",
				});
				btnCancel.addEventListener("click", () => this.close());
			});

			formEl.addEventListener("submit", (e) => this.onSubmit(e, input.value));
		});
	}
}
