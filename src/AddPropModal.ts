import { Modal, App } from "obsidian";
import PropForm from "./AddPropForm.svelte";
import { NewPropData } from "./main";
import { AddConfirmModal } from "./AddConfirmModal";
import { Property, PropertyTypes } from "./types/custom";

/** Loads a modal and handles form submissions. */
export class PropModal extends Modal {
  submission: (customProps: Map<string, any>) => void;
  props: Map<string, NewPropData>;
  overwrite: boolean;
  delimiter: string;
  defaultProps: { name: string; value: any; type: PropertyTypes }[];
  changeBool: (bool: boolean) => void;
  component: PropForm;
  suggestedProps: Property[];

  constructor(
    app: App,
    submission: (customProps: Map<string, any>) => Promise<void>,
    overwrite: boolean,
    delimiter: string,
    defaultProps: any,
    changeBool: (bool: boolean) => void,
    suggestedProps: Property[]
  ) {
    super(app);
    this.submission = submission;
    this.overwrite = overwrite;
    this.delimiter = delimiter;
    this.defaultProps = defaultProps;
    this.changeBool = changeBool;
    this.suggestedProps = suggestedProps;
  }

  //Run form submission if user clicks confirm.
  onConfirm() {
    this.submission(this.props);
    this.close();
  }

  updateBool(bool: boolean) {
    this.overwrite = bool;
    this.changeBool(bool);
  }

  //Pull up confirmation form when user submits base form.
  onSubmit(props: Map<string, NewPropData>) {
    this.props = props;
    new AddConfirmModal(
      this.app,
      this.props,
      this.overwrite,
      this.onConfirm.bind(this)
    ).open();
  }

  onOpen(): void {
    this.titleEl.createEl("h2", { text: "Add Properties" });

    this.component = new PropForm({
      target: this.contentEl,
      props: {
        submission: this.onSubmit.bind(this),
        overwrite: this.overwrite,
        delimiter: this.delimiter,
        defaultProps: this.defaultProps,
        changeBool: this.updateBool.bind(this),
        suggestedProps: this.suggestedProps,
      },
    });
  }
}
