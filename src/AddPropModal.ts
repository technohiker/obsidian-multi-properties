import { Modal, App } from "obsidian";
import PropForm from "./AddPropForm.svelte";
import { NewPropData } from "./main";
import { AddConfirmModal } from "./AddConfirmModal";

/** Loads a modal and handles form submissions. */
export class PropModal extends Modal {
	submission: (customProps: Map<string, any>) => void;
	props: Map<string, NewPropData>;
	component: PropForm;

	constructor(app: App, submission: (customProps: Map<string, any>) => void) {
		super(app);
		this.submission = submission;
	}

	onConfirm(bool: boolean) {
		if (bool) {
			this.submission(this.props);
			this.close();
		}
	}

	onSubmit(props: Map<string, NewPropData>) {
		this.props = props;
		new AddConfirmModal(this.app, this.props, this.onConfirm.bind(this)).open();
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
