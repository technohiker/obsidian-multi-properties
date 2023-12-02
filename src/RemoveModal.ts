/** Modal to hold form that lets user remove props from selection. */

import { Modal, App } from "obsidian";
import RemovePropForm from "./RemovePropForm.svelte";
import { NewPropData } from "./main";

/** Loads a modal and handles form submissions. */
export class RemoveModal extends Modal {
	submission: (customProps: string[]) => void;
	component: RemovePropForm;

	constructor(app: App, submission: (customProps: string[]) => void) {
		super(app);
		this.submission = submission;
	}

	onSubmit(props: string[]) {
		this.submission(props);
		this.close();
	}

	onOpen(): void {
		this.titleEl.createEl("h2", { text: "Remove Properties" });

		this.component = new RemovePropForm({
			target: this.contentEl,
			props: {
				submission: this.onSubmit.bind(this),
			},
		});
	}
}
