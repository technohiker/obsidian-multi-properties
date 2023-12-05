/** Modal to hold form that lets user remove props from selection. */

import { Modal, App } from "obsidian";
import RemoveConfirmForm from "./RemoveConfirmForm.svelte";

/** Loads a modal and handles form submissions. */
export class RemoveModal extends Modal {
	names: string[];
	submission: (customProps: string[]) => void;
	component: RemoveConfirmForm;

	constructor(
		app: App,
		names: string[],
		submission: (customProps: string[]) => void
	) {
		super(app);
		this.names = names;
		this.submission = submission;
		console.log(this.names);
	}

	onSubmit() {
		this.close();
		return true;
	}

	onOpen(): void {
		this.titleEl.createEl("h2", { text: "Remove Properties" });

		this.component = new RemoveConfirmForm({
			target: this.contentEl,
			props: {
				submission: this.onSubmit.bind(this),
				close: this.close.bind(this),
			},
		});
	}
}
