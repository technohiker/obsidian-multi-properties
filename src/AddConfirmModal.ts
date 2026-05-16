/** Modal to hold form that lets user remove props from selection. */

import { Modal, App, Notice } from "obsidian";
import { mount } from "svelte";
import AddConfirmForm from "./AddConfirmForm.svelte";
import type { NewPropData } from "./main";
import type { MultiPropSettings } from "./SettingTab";
import type en from "./i18n/en";

/** Loads a modal and handles form submissions. */
export class AddConfirmModal extends Modal {
  props: Map<string, NewPropData>;
  submission: () => Promise<void>;
  alterProp: MultiPropSettings["alterProp"];
  component: any;
  t: typeof en;

  constructor(
    app: App,
    props: Map<string, NewPropData>,
    alterProp: MultiPropSettings["alterProp"],
    submission: () => Promise<void>,
    t: typeof en
  ) {
    super(app);
    this.props = props;
    this.alterProp = alterProp;
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
    this.titleEl.createEl("h2", { text: this.t.addPropertiesTitle });

    this.component = mount(AddConfirmForm, {
      target: this.contentEl,
      props: {
        newProps: this.props,
        alterProp: this.alterProp,
        submission: this.onSubmit.bind(this),
        cancel: this.onCancel.bind(this),
        t: this.t,
      },
    });
  }
}
