import { Modal, TFolder, TAbstractFile, App } from "obsidian";

export class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	submission: (app: App, obj: any, string: string) => void;
	options: Record<string, string> = {
		Text: "string",
		Number: "number",
		Tag: "string",
		Checkbox: "checkbox",
		Date: "date",
		"date & time": "datetime-local",
	};

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
			formEl.createEl("div", { cls: "modal-input-container" }, (divEl) => {
				let selectEl = divEl.createEl("select", { value: "test" });

				for (let key of Object.keys(this.options)) {
					selectEl.createEl("option", { value: this.options[key], text: key });
				}

				let input = divEl.createEl("input", { type: selectEl.value });

				let addButton = divEl.createEl("button", { value: "Add" });

				//How to add for Enter as well?
				addButton.addEventListener("click", (e: Event) => {
					e.preventDefault();
					formEl.appendChild(divEl); //Appearing in the wrong place.
				});

				selectEl.addEventListener("change", (e: Event) => {
					e.preventDefault();
					input.type = selectEl.value;
				});
			});

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
				console.log(this);
				btnCancel.addEventListener("click", () => this.close());
			});

			formEl.addEventListener("submit", (e) => {
				e.preventDefault();
				console.log({ e });
			});
		});
	}
}
