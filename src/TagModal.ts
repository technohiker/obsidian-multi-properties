import { Modal, TFolder, TAbstractFile, App } from "obsidian";

export class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	submission: (app: App, obj: any, string: string) => void;

	constructor(
		app: App,
		base: TFolder | TAbstractFile[],
		submission: (app: App, obj: any, string: string) => void
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
		this.submission(this.app, this.base, input);
		this.close();
	}

	onOpen(): void {
		this.modalEl.addClass("modal");

		const { contentEl, titleEl } = this;

		//Create text.
		titleEl.createEl("h2", { text: "Please type in a tag." });
		contentEl.createEl("span", {
			text: "Whatever text is inputted will be appended to all selected files as text.  Place '#' signs to identify tags.",
		});

		//Create form object.
		contentEl.createEl("form", { cls: "modal-form" }, (formEl) => {
			let input = formEl.createEl("input", { value: this.default });

			formEl.createDiv("modal-button-container", (buttonEl) => {
				let btnSubmit = buttonEl.createEl("button", {
					text: "Submit",
					type: "submit",
					cls: "mod-cta",
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
