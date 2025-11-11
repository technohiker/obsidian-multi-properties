/** Modal to hold form that lets user remove props from selection. */

import { Modal, App, Notice } from "obsidian";
import { mount } from "svelte";
import RemoveConfirmForm from "./RemoveConfirmForm.svelte";

/** Loads a modal and handles form submissions. */
export class RemoveConfirmModal extends Modal {
  names: string[];
  submission: () => Promise<void>;
  component: any;

  constructor(app: App, names: string[], submission: () => Promise<void>) {
    super(app);
    this.names = names;
    this.submission = submission;
  }

  onSubmit() {
    this.submission();
    this.close();
  }

  onCancel() {
    this.close();
  }

  onOpen(): void {
    //Prevent modal from opening if no names are passed.
    if (!this.names || this.names.length === 0) {
      new Notice("Please check at least one property to remove.");
      this.close();
    }
    this.titleEl.createEl("h2", { text: "Remove Properties" });

    this.component = mount(RemoveConfirmForm, {
      target: this.contentEl,
      props: {
        names: this.names,
        submission: this.onSubmit.bind(this),
        cancel: this.onCancel.bind(this),
      },
    });
  }
}
