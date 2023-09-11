import {
	Modal,
	TFolder,
	TAbstractFile,
	App,
	getIconIds,
	getIcon,
	setIcon,
} from "obsidian";

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

		let icon = getIcon("lucide-tags");

		console.log({ icon });

		const { contentEl, titleEl } = this;

		//Create text.
		titleEl.createEl("h2", { text: "Please type in a tag." });
		contentEl.createEl("span", {
			text: "Whatever text is inputted will be appended to all selected files as text.  Place '#' signs to identify tags.",
		});

		//Create form object.
		let formEl = contentEl.createEl("form", { cls: "modal-form" });

		//Container to hold all possible inputs.
		//TODO: Make it scrollable.
		let inputDiv = formEl.createEl("div", {
			cls: "modal-inputs-container",
		});

		//Container for holding inputs.
		let propDiv = inputDiv.createEl("div", {
			cls: "modal-input-container",
		});

		//Let user choose what type of input they want.
		let selectEl = propDiv.createEl("select", { value: "test" });
		for (let key of Object.keys(this.options)) {
			selectEl.createEl("option", { value: this.options[key], text: key });
		}

		//Property name.
		let labelEl = propDiv.createEl("input", {
			type: "string",
			attr: { name: "name[]" },
		}); //Should have different style.
		//Property value.
		let inputEl = propDiv.createEl("input", {
			type: selectEl.value,
			attr: { name: "value[]" },
		});

		//setIcon(inputDiv, "tags");

		selectEl.addEventListener("change", (e: Event) => {
			e.preventDefault();
			inputEl.type = selectEl.value;
		});

		let btnContainer = formEl.createDiv("modal-button-container");

		let addButton = btnContainer.createEl("button", {
			value: "Add",
			text: "Add",
		});

		addButton.onClickEvent((e: Event) => {
			e.preventDefault();
			inputDiv.appendChild(propDiv.cloneNode(true));
			//TODO: Set up event listener to run event on keyboard press as well.
		});

		let btnSubmit = btnContainer.createEl("button", {
			text: "Submit",
			type: "submit",
			cls: "mod-cta",
		});
		let btnCancel = btnContainer.createEl("button", {
			text: "Cancel",
			type: "cancel",
		});

		btnCancel.addEventListener("click", () => this.close());

		formEl.addEventListener("submit", (e) => {
			e.preventDefault();
			console.log({ e });
			let formData = new FormData(formEl);

			let obj = new Map();
			formData.forEach((value, key) => {
				console.log({ value, key });
			});
			let names = formData.getAll("name[]");
			let values = formData.getAll("value[]");

			for (let i = 0; i < names.length; i++) {
				//Check if obj already has name.  If so, add value of matching index to array.
				if (obj.has(names[i])) {
					let arr = [obj.get(names[i])];
					arr.push(values[i]);
					obj.set(names[i], arr);
					continue;
				}
				obj.set(names[i], values[i]);
			}
			console.log({ obj });
			// formData.getAll("name[]").forEach((value, index) => {
			// 	obj.set(value, formData.get(value.valueOf().toString()));
			// 	console.log({ obj });
			// });
		});

		console.log({ formEl, divContainer: propDiv, btnContainer });
	}
}
