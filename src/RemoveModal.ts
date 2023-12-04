/** Modal to hold form that lets user remove props from selection. */

import { Modal, App } from "obsidian";
import RemovePropForm from "./RemovePropForm.svelte";
import { NewPropData } from "./main";

/** Loads a modal and handles form submissions. */
export class RemoveModal extends Modal {
	names: string[];
	submission: (customProps: string[]) => void;
	component: RemovePropForm;

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

	onSubmit(props: string[]) {
		this.submission(props);
		console.log({ props });
		this.close();
	}

	onOpen(): void {
		this.titleEl.createEl("h2", { text: "Remove Properties" });

		this.component = new RemovePropForm({
			target: this.contentEl,
			props: {
				names: this.names,
				submission: this.onSubmit.bind(this),
			},
		});
	}
}
