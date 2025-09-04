import { Menu, Notice, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";
import { PropModal } from "./AddPropModal";
import { MultiPropSettings, SettingTab } from "./SettingTab";
import { RemoveModal } from "./RemoveModal";
import { addProperties, addPropToSet, removeProperties } from "./frontmatter";
import { PropertyTypes } from "./types/custom";

const defaultSettings: MultiPropSettings = {
  overwrite: false,
  recursive: true,
  delimiter: ",",
  defaultPropPath: "",
};

export interface NewPropData {
  type: string;
  data: string | string[] | null;
  overwrite: boolean;
  delimiter: string;
}

export default class MultiPropPlugin extends Plugin {
  settings: MultiPropSettings;
  async loadSettings() {
    this.settings = Object.assign({}, defaultSettings, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async changeOverwrite(bool: boolean) {
    this.settings.overwrite = bool;
    await this.saveSettings();
  }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new SettingTab(this.app, this));

    /** Add menu item on folder right-click to add properties to all notes in folder.
     * PropModal returns Props on submit, which is then passed to searchThroughFolders via callback.
     */
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, folder) => {
        if (folder instanceof TFolder) {
          menu.addItem((item) => {
            item
              .setIcon("archive")
              .setTitle("Add props to folder's notes")
              .onClick(() => this.createPropModal(folder));
          });
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, folder) => {
        if (folder instanceof TFolder) {
          menu.addItem((item) => {
            item
              .setIcon("archive")
              .setTitle("Remove props from folder's notes")
              .onClick(async () => this.createRemoveModal(folder));
          });
        }
      })
    );

    /** Add menu item on multi-file right-click to add properties to all notes in selection.
     * PropModal returns Props on submit, which is then passed to searchThroughFiles via callback.
     */
    this.registerEvent(
      this.app.workspace.on("files-menu", (menu, files) => {
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Add props to selected files")
            .onClick(() => this.createPropModal(files));
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("files-menu", (menu, files) => {
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Remove props from selected files")
            .onClick(async () => this.createRemoveModal(files));
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("search:results-menu", (menu: Menu, leaf: any) => {
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Add props to search results")
            .onClick(() => {
              let files = this.getFilesFromSearch(leaf);
              if (!files.length) {
                new Notice("No files to add properties to.", 4000);
                return;
              }
              this.createPropModal(files);
            });
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("search:results-menu", (menu: Menu, leaf: any) => {
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Remove props from search results")
            .onClick(async () => {
              let files = this.getFilesFromSearch(leaf);
              if (!files.length) {
                new Notice("No files to remove properties from.", 4000);
                return;
              }
              this.createRemoveModal(files);
            });
        });
      })
    );
  }
  async getPropsFromFolder(folder: TFolder, names: Set<string>) {
    for (let obj of folder.children) {
      if (obj instanceof TFile && obj.extension === "md") {
        names = await addPropToSet(this.app, names, obj);
      }
      if (obj instanceof TFolder) {
        if (this.settings.recursive) {
          await this.getPropsFromFolder(obj, names);
        }
      }
    }
    return [...names].sort();
  }

  async getPropsFromFiles(files: TAbstractFile[], names: Set<string>) {
    for (let file of files) {
      if (file instanceof TFile && file.extension === "md") {
        names = await addPropToSet(this.app, names, file);
      }
    }
    return [...names];
  }

  /** Iterates through all files in a folder and runs callback on each file. */
  searchFolders(folder: TFolder, callback: (file: TFile) => any) {
    for (let obj of folder.children) {
      if (obj instanceof TFolder) {
        if (this.settings.recursive) {
          this.searchFolders(obj, callback);
        }
      }
      if (obj instanceof TFile && obj.extension === "md") {
        callback(obj);
      }
    }
  }

  /** Iterates through selection of files and runs a given callback function on that file. */
  searchFiles(files: TAbstractFile[], callback: (file: TFile) => any) {
    for (let file of files) {
      if (file instanceof TFile && file.extension === "md") {
        callback(file);
      }
    }
  }

  /** Get all files from a search result. */
  getFilesFromSearch(leaf: any) {
    let files: TFile[] = [];
    leaf.dom.vChildren.children.forEach((e: any) => {
      files.push(e.file);
    });
    return files;
  }

  /** Create modal for adding properties.
   * Will call a different function depending on whether files or a folder is used. */
  createPropModal(iterable: TAbstractFile[] | TFolder) {
    let iterateFunc;
    this.app.vault.getAllLoadedFiles;
    if (iterable instanceof TFolder) {
      iterateFunc = (props: Map<string, any>) =>
        this.searchFolders(iterable, this.addPropsCallback(props));
    } else {
      iterateFunc = (props: Map<string, any>) =>
        this.searchFiles(iterable, this.addPropsCallback(props));
    }

    let defaultProps: { name: string; value: any; type: PropertyTypes }[];
    if (!this.settings.defaultPropPath) {
      defaultProps = [{ name: "", value: "", type: "text" }];
    } else {
      try {
        const file = this.app.vault.getAbstractFileByPath(
          `${this.settings.defaultPropPath}.md`
        );
        let tmp = this.readYamlProperties(file as TFile);
        if (tmp === undefined) throw Error("Undefined path.");
        defaultProps = tmp;
      } catch (e) {
        new Notice(
          `${e}.  Check if you entered a valid path in the Default Props File setting.`,
          10000
        );
        defaultProps = [];
      }
    }
    const allProps = this.getAllUsedProperties();

    new PropModal(
      this.app,
      iterateFunc,
      this.settings.overwrite,
      this.settings.delimiter,
      defaultProps,
      this.changeOverwrite.bind(this),
      allProps
    ).open();
  }

  getAllUsedProperties(): string[] {
    const allProps = this.app.metadataCache.getAllPropertyInfos();
    return Object.keys(allProps).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }

  /** Create modal for removing properties.
   * Will call a different function depending on whether files or a folder is used. */
  async createRemoveModal(iterable: TAbstractFile[] | TFolder) {
    let names;
    let iterateFunc;

    if (iterable instanceof TFolder) {
      names = await this.getPropsFromFolder(iterable, new Set());
      iterateFunc = (props: string[]) =>
        this.searchFolders(iterable, this.removePropsCallback(props));
    } else {
      names = await this.getPropsFromFiles(iterable, new Set());
      iterateFunc = (props: string[]) =>
        this.searchFiles(iterable, this.removePropsCallback(props));
    }
    if (names.length === 0) {
      new Notice("No properties to remove", 4000);
      return;
    }

    const sortedNames = [...names].sort((a, b) =>
      a.toLowerCase() > b.toLowerCase() ? 1 : -1
    );

    new RemoveModal(this.app, sortedNames, iterateFunc).open();
  }

  /** Read through a given file and get name/value of props.
   *  Revised from https://forum.obsidian.md/t/how-to-programmatically-access-a-files-properties-types/77826/4.
   */
  readYamlProperties(file: TFile) {
    const metadata = this.app.metadataCache.getFileCache(file);
    const frontmatter = metadata?.frontmatter;

    console.log({ frontmatter });

    if (!frontmatter) {
      new Notice("Not a valid Props template.", 4000);
      return;
    }

    const allPropsWithType = this.app.metadataCache.getAllPropertyInfos();

    let result: { name: string; value: any; type: PropertyTypes }[] = [];

    for (let [key, value] of Object.entries(frontmatter)) {
      const keyLower = key.toLowerCase();
      const obj = {
        name: key,
        value: value,
        type: allPropsWithType[keyLower].type,
      };

      result.push(obj);
    }
    return result;
  }

  /** Callback function to run addProperties inside iterative functions.*/
  addPropsCallback(props: any) {
    return (file: TFile) => {
      addProperties(this.app, file, props, this.settings.overwrite);
    };
  }

  /** Callback function to run removeProperties inside iterative functions. */
  removePropsCallback(props: any) {
    return (file: TFile) => {
      removeProperties(this.app, file, props);
    };
  }
}
