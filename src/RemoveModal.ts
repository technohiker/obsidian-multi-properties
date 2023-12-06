/** Modal to hold form that lets user remove props from selection. */

import { Modal, App, Notice } from "obsidian";
import RemovePropForm from "./RemovePropForm.svelte";
import { NewPropData } from "./main";
import { RemoveConfirmModal } from "./RemoveConfirmModal";

/** Loads a modal and handles form submissions. */
export class RemoveModal extends Modal {
	names: string[];
	props: string[];
	submission: (customProps: string[]) => void;
	component: RemovePropForm;

	constructor(
		app: App,
		names: string[],
		submission: (customProps: string[]) => void
	) {
		if (!names || names.length === 0) {
			new Notice("No properties to remove");
			return;
		}
		super(app);
		this.names = names;
		this.submission = submission;
		console.log(this.names);
	}

	onConfirm(bool: boolean) {
		if (bool) {
			this.submission(this.props);
			this.close();
		}
	}

	onSubmit(props: string[]) {
		this.props = props;
		console.log("New Props: ", this.props);
		new RemoveConfirmModal(
			this.app,
			this.props,
			this.onConfirm.bind(this)
		).open();
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
