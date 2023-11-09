import { Modal, TFolder, TAbstractFile, App } from "obsidian";
import PropForm from "./PropForm.svelte";

export class PropModal extends Modal {
	base: TFolder | TAbstractFile[];
	submission: (customProps: Map<string, any>) => void;
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
		submission: (customProps: Map<string, any>) => void
	) {
		super(app);

		this.base = base;
		this.submission = submission;
	}

	onSubmit(props: Map<string, any>) {
		//Run code for adding text to all files.
		this.submission(props);
		this.close();
	}

	onOpen(): void {
		this.titleEl.createEl("h2", { text: "Add Properties" });

		this.component = new PropForm({
			target: this.contentEl,
			props: {
				submission: this.onSubmit.bind(this),
			},
		});
	}
}
