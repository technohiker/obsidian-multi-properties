import { Modal, TFolder, TAbstractFile, App, getIcon } from "obsidian";
import { createInput } from "./input";
import "../styles.css";
import { parseValue } from "./helpers";

import PropForm from "./PropForm.svelte";

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
	component: PropForm;

	constructor(
		app: App,
		base: TFolder | TAbstractFile[],
		submission: (app: App, obj: any, customProps: Map<string, any>) => void
	) {
		super(app);

		//Removes potential spaces in file names.
		if (base instanceof TFolder) {
			this.default = `#${base.name.replace(" ", "-")}`;
		}

		this.base = base;
		this.submission = submission;
	}

	onSubmit(e: Event, props: Map<string, any>) {
		//Run code for adding text to all files.
		this.submission(this.app, this.base, props);
		this.close();
	}

	onOpen(): void {
		this.component = new PropForm({
			target: this.modalEl,
		});

		// this.modalEl.addClass("modal");
		// const { contentEl, titleEl } = this;
		// //Create text.
		// titleEl.createEl("h2", { text: "Add Properties" });
		// contentEl.createEl("span", {
		// 	text: `Type in a property name, then value.  Use the dropbox to choose what type of data you wish to store.`,
		// });
		// contentEl.createEl("br");
		// contentEl.createEl("br");
		// contentEl.createEl("span", {
		// 	text: `If you want to make a List property, use the same name for each entry to the list.`,
		// });
		// contentEl.createEl("br");
		// contentEl.createEl("br");
		// contentEl.createEl("span", {
		// 	text: `If you want to add Tags, use the name "tags."`,
		// });
		// //Create form object.
		// let formEl = contentEl.createEl("form", { cls: "modal-form" });
		// //Container to hold all possible inputs.
		// let inputDiv = formEl.createEl("div", {
		// 	cls: "modal-inputs-container",
		// });
		// //Container for each group of inputs.
		// let propDiv = createInput(this.options);
		// inputDiv.appendChild(propDiv);
		// let addDiv = formEl.createDiv("modal-add-container");
		// let addButton = addDiv.createEl("a", {
		// 	value: "Add",
		// 	text: "Add",
		// 	cls: "a-btn",
		// 	href: "href",
		// });
		// addButton.onClickEvent((e: Event) => {
		// 	console.log(e);
		// 	e.preventDefault();
		// 	let newDiv = createInput(this.options, true);
		// 	inputDiv.appendChild(newDiv);
		// 	//Move tab index to the newDiv's first input, and select text in it.
		// 	newDiv.querySelector("input")?.focus();
		// 	//TODO: Set up event listener to run event on keyboard press as well.
		// });
		// let btnContainer = formEl.createDiv("modal-button-container");
		// let btnSubmit = btnContainer.createEl("button", {
		// 	text: "Submit",
		// 	type: "submit",
		// 	cls: "btn-submit",
		// });
		// let btnCancel = btnContainer.createEl("button", {
		// 	text: "Cancel",
		// 	type: "cancel",
		// 	cls: "btn-cancel",
		// });
		// btnCancel.addEventListener("click", () => this.close());
		// btnCancel.addEventListener("enter", () => this.close());
		// formEl.addEventListener("submit", (e) => {
		// 	e.preventDefault();
		// 	let obj = new Map();
		// 	let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll(
		// 		'input[name^="name[]"]'
		// 	);
		// 	inputs.forEach((input) => {
		// 		let name = input.value;
		// 		if (input.nextElementSibling instanceof HTMLInputElement) {
		// 			let value = parseValue(
		// 				input.nextElementSibling.value,
		// 				input.nextElementSibling.type
		// 			);
		// 			if (value === "") return; //Do not add properties with no value.
		// 			console.log({ input, value });
		// 			if (obj.has(name)) {
		// 				let arr = [obj.get(name)];
		// 				arr.push(value);
		// 				obj.set(name, arr);
		// 			} else {
		// 				obj.set(name, value);
		// 			}
		// 		}
		// 	});
		// 	this.onSubmit(e, obj);
		// });
	}
}
