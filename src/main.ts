import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  TFolder,
  View,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this));

    //Add menu item that prints all children of folder.
    this.app.workspace.on('file-menu', (menu, file, source) => {
      if (file instanceof TFolder) {
        menu.addItem((item) => {
          item.setIcon('dice').setTitle("Get File Names").onClick(() => new TagModal(this.app, file).open())
        })
      }
    })
  }

  onunload() { }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

}

/** Get all files belonging to a folder and print their file names. */
function appendTextToFiles(folder: TFolder, string: string) {
  for (let child of folder.children) {
    if (child instanceof TFolder) {
      appendTextToFiles(child, string)
    }
    if (child instanceof TFile && child.extension === "md") {
      this.app.vault.append(child, `\n#${string}`)
    }
  }
}

class TagModal extends Modal {
  input: string;
  folder: TFolder

  constructor(app: App, folder: TFolder) {
    super(app);
    this.input = folder.name.replace(' ', '-');  //Remove potential spaces in file names.  Should I also remove capitalization?
    this.folder = folder;

    this.modalEl.addClass('modal')

    const { contentEl, titleEl } = this;

    titleEl.createEl('h2', { text: "Please add a tag." })

    // contentEl.createDiv('form-div', (formEl) => {
    //   //  let input = formEl.createEl('input', { value: this.input })

    //   formEl.createDiv('modal-button-container', (buttonEl) => {
    //     let btnSubmit = buttonEl.createEl('button', { text: 'Submit', type: 'submit', cls: 'mod-cra' })
    //     btnSubmit.addEventListener('click', () => this.onSubmit())

    //     let btnCancel = buttonEl.createEl('button', { text: 'Cancel' })
    //     btnCancel.addEventListener('click', () => this.close())
    //   })
    // })

    contentEl.createEl('form', { cls: 'modal-form' }, (formEl) => {
      let input = formEl.createEl('input', { value: this.input })
      formEl.createDiv('modal-button-container', (buttonEl) => {
        let btnSubmit = buttonEl.createEl('button', { text: 'Submit', type: 'submit', cls: 'mod-cra' })

        let btnCancel = buttonEl.createEl('button', { text: 'Cancel', type: 'cancel' })
        btnCancel.addEventListener('click', () => this.close())
      })

      formEl.addEventListener('submit', (e) => this.onSubmit(e, input.value))
    })
  }

  onSubmit(e: Event, input: string) {
    e.preventDefault();
    //Run code for adding text to all files.
    appendTextToFiles(this.folder, input);
    this.close();
  }

  onOpen(): void {
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
