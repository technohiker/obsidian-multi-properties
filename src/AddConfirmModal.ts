/** Modal to hold form that lets user remove props from selection. */

import { Modal, App, Notice } from "obsidian";
import AddConfirmForm from "./AddConfirmForm.svelte";
import { NewPropData } from "./main";

/** Loads a modal and handles form submissions. */
export class AddConfirmModal extends Modal {
	props: Map<string, NewPropData>;
	submission: (bool: boolean) => Promise<void>;
	overwrite: boolean;
	component: AddConfirmForm;

	constructor(
		app: App,
		props: Map<string, NewPropData>,
		overwrite: boolean,
		submission: (bool: boolean) => Promise<void>
	) {
		super(app);
		this.props = props;
		this.overwrite = overwrite;
		this.submission = submission;
	}
	async onSubmit() {
		await this.submission(true);
		this.close();
	}

	onCancel() {
		this.submission(false);
		this.close();
	}

	onOpen(): void {
		this.titleEl.createEl("h2", { text: "Add Properties" });

		this.component = new AddConfirmForm({
			target: this.contentEl,
			props: {
				props: this.props,
				overwrite: this.overwrite,
				submission: this.onSubmit.bind(this),
				cancel: this.onCancel.bind(this),
			},
		});
	}
}
