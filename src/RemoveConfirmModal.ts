/** Modal to hold form that lets user remove props from selection. */

import { Modal, App, Notice } from "obsidian";
import { mount } from "svelte";
import RemoveConfirmForm from "./RemoveConfirmForm.svelte";
import type en from "./i18n/en";

/** Loads a modal and handles form submissions. */
export class RemoveConfirmModal extends Modal {
  names: string[];
  submission: () => Promise<void>;
  component: any;
  t: typeof en;

  constructor(app: App, names: string[], submission: () => Promise<void>, t: typeof en) {
    super(app);
    this.names = names;
    this.submission = submission;
    this.t = t;
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
      new Notice(this.t.pleaseCheckAtLeastOne);
      this.close();
    }
    this.titleEl.createEl("h2", { text: this.t.removePropertiesTitle });

    this.component = mount(RemoveConfirmForm, {
      target: this.contentEl,
      props: {
        names: this.names,
        submission: this.onSubmit.bind(this),
        cancel: this.onCancel.bind(this),
        t: this.t,
      },
    });
  }
}
