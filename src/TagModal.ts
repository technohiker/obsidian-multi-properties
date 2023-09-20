import { Modal, TFolder, TAbstractFile, App, getIcon } from "obsidian";
import { createInput } from "./input";
import "../styles.css";
import { parseValue } from "./helpers";

export class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	submission: (app: App, obj: any, customProps: Map<string, any>) => void;
	options: Record<string, string> = {
		Text: "string",
		Number: "number",
		Checkbox: "checkbox",
		Date: "date",
		Datetime: "datetime-local",
	};

	constructor(
		app: App,
		base: TFolder | TAbstractFile[],
		submission: (app: App, obj: any, customProps: Map<string, any>) => void
	) {
		super(app);

		//Removes potential spaces in file names.  Should I also remove capitalization?
		if (base instanceof TFolder) {
			this.default = `#${base.name.replace(" ", "-")}`;
		}

		this.base = base;
		this.submission = submission;
	}

	onSubmit(e: Event, props: Map<string, any>) {
		e.preventDefault();

		//Run code for adding text to all files.
		this.submission(this.app, this.base, props);
		this.close();
	}

	onOpen(): void {
		this.modalEl.addClass("modal");

		let icon = getIcon("lucide-tags");

		console.log({ icon });

		const { contentEl, titleEl } = this;

		//Create text.
		titleEl.createEl("h2", { text: "Add Properties." });

		contentEl.createEl("span", {
			text: `Type in a property name, then value.  Use the dropbox to choose what type of data you wish to store.  If you want to make a list property, use the same name for each entry to the list.`,
		});
		contentEl.createEl("br");
		contentEl.createEl("br");
		contentEl.createEl("span", {
			text: `If you want to add tags, use the name "tags."`,
		});

		//Create form object.
		let formEl = contentEl.createEl("form", { cls: "modal-form" });

		//Container to hold all possible inputs.
		let inputDiv = formEl.createEl("div", {
			cls: "modal-inputs-container",
		});

		//Container for each group of inputs.
		let propDiv = createInput(this.options);
		inputDiv.appendChild(propDiv);

		let addDiv = formEl.createDiv("modal-add-container");

		let addButton = addDiv.createEl("a", {
			value: "Add",
			text: "Add",
			cls: "btn-add",
		});

		addButton.onClickEvent((e: Event) => {
			console.log(e);
			e.preventDefault();

			let newDiv = createInput(this.options, true);
			inputDiv.appendChild(newDiv);

			//Move tab index to the newDiv's first input.
			newDiv.querySelector("input")?.focus();
			//TODO: Set up event listener to run event on keyboard press as well.
		});

		let btnContainer = formEl.createDiv("modal-button-container");

		let btnSubmit = btnContainer.createEl("button", {
			text: "Submit",
			type: "submit",
			cls: "btn-submit",
		});
		let btnCancel = btnContainer.createEl("button", {
			text: "Cancel",
			type: "cancel",
			cls: "btn-cancel",
		});

		btnCancel.addEventListener("click", () => this.close());
		btnCancel.addEventListener("enter", () => this.close());

		formEl.addEventListener("submit", (e) => {
			e.preventDefault();
			let curEl = document.activeElement;
			if (curEl instanceof HTMLInputElement) {
				//Submit function.
			} else if (curEl?.className === "delete-button") {
				//Delete function.
			} else if (curEl?.className === "btn-add") {
				//Add function.
			} else if (curEl?.className === "btn-submit") {
				//Submit function.
			}
			console.log(document.activeElement);
			console.log(e);
			//	let formData = new FormData(formEl);

			let obj = new Map();
			let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll(
				'input[name^="name[]"]'
			);
			let values: NodeListOf<HTMLInputElement> = formEl.querySelectorAll(
				'input[name^="value[]"]'
			);

			inputs.forEach((input) => {
				let name = input.value;
				if (input.nextElementSibling instanceof HTMLInputElement) {
					let value = parseValue(
						input.nextElementSibling.value,
						input.nextElementSibling.type
					);
					console.log({ input, value });
					if (obj.has(name)) {
						let arr = [obj.get(name)];
						arr.push(value);
						obj.set(name, arr);
					} else {
						obj.set(name, value);
					}
				}
			});

			this.onSubmit(e, obj);
		});

		console.log({ formEl, divContainer: propDiv, btnContainer });
	}

	/** Function that generates a specific input div for the modal. */
	createInput(
		options: Record<string, string>,
		isNew: boolean = false,
		label: string = ""
	) {
		let inputDiv = createEl(
			"div",
			{
				cls: "modal-input-container",
			},
			(el) => {
				//Create Select box and populate with options.
				let selectEl = el.createEl("select", { value: "test" });
				for (let key of Object.keys(options)) {
					selectEl.createEl("option", { value: options[key], text: key });
				}

				//Property name.
				let labelEl = el.createEl("input", {
					type: "string",
					attr: { name: "name[]", required: true },
					text: label,
				}); //Should have different style.
				//Property value.
				let inputEl = el.createEl("input", {
					type: selectEl.value,
					attr: { name: "value[]", required: true },
				});
				//If this is a new input, add a deletion button.
				if (isNew) {
					let deleteButton = el.createEl("button", {
						text: "X",
						cls: "delete-button",
					});
					deleteButton.addEventListener("click", (e: Event) => {
						e.preventDefault();
						el.remove();
					});
				}

				//Add event listener that changes input type based on select value.
				selectEl.addEventListener("change", (e: Event) => {
					e.preventDefault();
					console.log("Fired!");
					inputEl.type = selectEl.value;
				});
			}
		);
		return inputDiv;
	}
}
