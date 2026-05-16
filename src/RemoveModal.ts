/** Modal to hold form that lets user remove props from selection. */

import { Modal, App, Notice } from "obsidian";
import { mount } from "svelte";
import RemovePropForm from "./RemovePropForm.svelte";
import { RemoveConfirmModal } from "./RemoveConfirmModal";
import type en from "./i18n/en";

/** Loads a modal and handles form submissions. */
export class RemoveModal extends Modal {
  names: string[];
  props: string[];
  submission: (customProps: string[]) => Promise<void>;
  component: any;
  t: typeof en;

  constructor(
    app: App,
    names: string[],
    submission: (customProps: string[]) => Promise<void>,
    t: typeof en
  ) {
    if (!names || names.length === 0) {
      new Notice(t.noPropertiesToRemove);
      return;
    }
    super(app);
    this.names = names;
    this.submission = submission;
    this.t = t;
  }

  onConfirm() {
    this.submission(this.props);
    this.close();
  }

  onSubmit(props: string[]) {
    this.props = props;
    new RemoveConfirmModal(
      this.app,
      this.props,
      this.onConfirm.bind(this),
      this.t
    ).open();
  }

  onOpen(): void {
    this.titleEl.createEl("h2", { text: this.t.removePropertiesTitle });

    this.component = mount(RemovePropForm, {
      target: this.contentEl,
      props: {
        names: this.names,
        submission: this.onSubmit.bind(this),
        t: this.t,
      },
    });
  }
}
