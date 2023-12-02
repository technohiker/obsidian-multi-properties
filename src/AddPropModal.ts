import { Modal, App } from "obsidian";
import PropForm from "./AddPropForm.svelte";
import { NewPropData } from "./main";

/** Loads a modal and handles form submissions. */
export class PropModal extends Modal {
	submission: (customProps: Map<string, any>) => void;
	component: PropForm;

	constructor(app: App, submission: (customProps: Map<string, any>) => void) {
		super(app);
		this.submission = submission;
	}

	onSubmit(props: Map<string, NewPropData>) {
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
