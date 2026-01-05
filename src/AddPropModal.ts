import { Modal, App } from "obsidian";
import { mount } from "svelte";
import PropForm from "./AddPropForm.svelte";
import type { NewPropData } from "./main";
import { AddConfirmModal } from "./AddConfirmModal";
import type { Property, PropertyTypes } from "./types/custom";
import type { MultiPropSettings } from "./SettingTab";

/** Loads a modal and handles form submissions. */
export class PropModal extends Modal {
  submission: (customProps: Map<string, any>) => Promise<void>;
  props: Map<string, NewPropData>;
  alterProp: MultiPropSettings["alterProp"];
  delimiter: string;
  defaultProps: { name: string; value: any; type: PropertyTypes }[];
  changeSetting: (value: MultiPropSettings["alterProp"]) => void;
  component: any;
  suggestedProps: Property[];

  constructor(
    app: App,
    submission: (customProps: Map<string, any>) => Promise<void>,
    alterProp: MultiPropSettings["alterProp"],
    delimiter: string,
    defaultProps: any,
    changeSetting: (value: MultiPropSettings["alterProp"]) => void,
    suggestedProps: Property[]
  ) {
    super(app);
    this.submission = submission;
    this.alterProp = alterProp;
    this.delimiter = delimiter;
    this.defaultProps = defaultProps;
    this.changeSetting = changeSetting;
    this.suggestedProps = suggestedProps;
  }

  //Run form submission if user clicks confirm.
  onConfirm() {
    this.submission(this.props);
    this.close();
  }

  updateSetting(value: MultiPropSettings["alterProp"]) {
    this.alterProp = value;
    this.changeSetting(value);
  }

  //Pull up confirmation form when user submits base form.
  onSubmit(props: Map<string, NewPropData>) {
    this.props = props;
    new AddConfirmModal(
      this.app,
      this.props,
      this.alterProp === "overwrite",
      this.alterProp,
      this.onConfirm.bind(this)
    ).open();
  }

  onOpen(): void {
    this.titleEl.createEl("h2", { text: "Add Properties" });

    this.component = mount(PropForm, {
      target: this.contentEl,
      props: {
        submission: this.onSubmit.bind(this),
        overwrite: true,
        alterProp: this.alterProp,
        delimiter: this.delimiter,
        defaultProps: this.defaultProps,
        changeBool: this.updateSetting.bind(this),
        changeSetting: this.updateSetting.bind(this),
        suggestedProps: this.suggestedProps,
      },
    });
  }
}
