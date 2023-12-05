/** Modal to hold form that lets user remove props from selection. */

import { Modal, App } from "obsidian";
import RemoveConfirmForm from "./RemoveConfirmForm.svelte";

/** Loads a modal and handles form submissions. */
export class RemoveConfirmModal extends Modal {
	names: string[];
	submission: (bool: boolean) => void;
	component: RemoveConfirmForm;

	constructor(app: App, names: string[], submission: (bool: boolean) => void) {
		super(app);
		this.names = names;
		this.submission = submission;
		console.log(this.names);
	}

	onSubmit() {
		this.submission(true);
		this.close();
	}

	onCancel() {
		this.submission(false);
		this.close();
	}

	onOpen(): void {
		this.titleEl.createEl("h2", { text: "Remove Properties" });

		this.component = new RemoveConfirmForm({
			target: this.contentEl,
			props: {
				names: this.names,
				submission: this.onSubmit.bind(this),
				cancel: this.onCancel.bind(this),
			},
		});
	}
}
