import { App, Modal, Plugin, TFile, TFolder } from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		//Add menu item for multi-tag functionality.  Set as Event to automatically be unloaded when needed.
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setIcon("dice")
							.setTitle("Tag All Files")
							.onClick(() =>
								new TagModal(this.app, file, appendTextToFiles).open()
							);
					});
				}
			})
		);
	}

	onunload() {}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

/** Get all files belonging to a folder and print their file names. */
function appendTextToFiles(folder: TFolder, string: string) {
	for (let child of folder.children) {
		if (child instanceof TFolder) {
			appendTextToFiles(child, string);
		}
		if (child instanceof TFile && child.extension === "md") {
			this.app.vault.append(child, `\n#${string}`);
		}
	}
}

class TagModal extends Modal {
	default: string;
	folder: TFolder;
	submission: (folder: TFolder, string: string) => void;

	constructor(
		app: App,
		folder: TFolder,
		submission: (folder: TFolder, string: string) => void
	) {
		super(app);
		this.default = folder.name.replace(" ", "-"); //Removes potential spaces in file names.  Should I also remove capitalization?
		this.folder = folder;
		this.submission = submission;
	}

	onSubmit(e: Event, input: string) {
		e.preventDefault();

		//Run code for adding text to all files.
		this.submission(this.folder, input);
		this.close();
	}

	onOpen(): void {
		this.modalEl.addClass("modal");

		const { contentEl, titleEl } = this;

		titleEl.createEl("h2", { text: "Please add a tag." });

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
			//TODO: Clean input value so only a single word will be added.
		});
	}
}
