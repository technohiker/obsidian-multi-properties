import { Modal, App } from "obsidian";
import PropForm from "./PropForm.svelte";

/** Loads a modal and handles form submissions. */
export class PropModal extends Modal {
	submission: (customProps: Map<string, any>) => void;
	component: PropForm;

	//All input types that are accepted as props by Obsidian.
	//Used for <select> in PropForm.
	options: Record<string, string> = {
		Text: "string",
		Number: "number",
		Checkbox: "checkbox",
		Date: "date",
		Datetime: "datetime-local",
	};

	constructor(app: App, submission: (customProps: Map<string, any>) => void) {
		super(app);
		this.submission = submission;
	}

	onSubmit(props: Map<string, any>) {
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
