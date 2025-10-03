import {
  Menu,
  Notice,
  Plugin,
  TAbstractFile,
  TFile,
  TFolder,
  FileView,
  WorkspaceLeaf,
  WorkspaceTabs,
} from "obsidian";
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

  private _getFilesFromTabGroup(leaf: WorkspaceLeaf | null): TFile[] {
    if (!leaf) {
      return [];
    }

    const files: TFile[] = [];
    const fileSet = new Set<string>();
    const activeParent = leaf.parent;

    if (activeParent instanceof WorkspaceTabs) {
      this.app.workspace.iterateAllLeaves((l) => {
        if (l.parent === activeParent && l.view instanceof FileView) {
          const file = l.view.file;
          if (file && !fileSet.has(file.path)) {
            files.push(file);
            fileSet.add(file.path);
          }
        }
      });
    } else {
      // Fallback for pop-out windows or other cases
      const activeWindowRoot = leaf.getRoot();
      this.app.workspace.iterateAllLeaves((l) => {
        if (l.getRoot() === activeWindowRoot && l.view instanceof FileView) {
          const file = l.view.file;
          if (file && !fileSet.has(file.path)) {
            files.push(file);
            fileSet.add(file.path);
          }
        }
      });
    }

    return files;
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingTab(this.app, this));

    // All commands for single notes & folders.
    this.addCommand({
      id: "add-props-to-current-note",
      name: "Add props to current note",
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new Notice("No active file to add properties to.", 4000);
          return;
        }
        await this.createPropModal([file]);
      },
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, node) => {
        let title = "";
        let obj: TFolder | TFile[];

        if (node instanceof TFile) {
          obj = [node];
          title = "Add props to file.";
        } else {
          obj = node as TFolder;
          title = "Add props to folder.";
        }

        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle(title)
            .onClick(() => this.createPropModal(obj));
        });
      })
    );

    this.addCommand({
      id: "remove-props-from-current-note",
      name: "Remove props from current note",
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new Notice("No active file to remove properties from.", 4000);
          return;
        }
        await this.createRemoveModal([file]);
      },
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, node) => {
        let title = "";
        let obj: TFolder | TFile[];

        if (node instanceof TFile) {
          obj = [node];
          title = "Remove props from file.";
        } else {
          obj = node as TFolder;
          title = "Remove props from folder.";
        }

        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle(title)
            .onClick(() => this.createRemoveModal(obj));
        });
      })
    );

    //All commands for affecting props in all tabs.
    this.addCommand({
      id: "add-props-to-tab-group",
      name: "Add props to tabs in active tab group",
      callback: async () => {
        const files = this._getFilesFromTabGroup(this.app.workspace.activeLeaf);
        if (!files || !files.length) {
          new Notice(
            "No open tabs in the active tab group to add properties to.",
            4000
          );
          return;
        }
        await this.createPropModal(files);
      },
    });

    this.registerEvent(
      this.app.workspace.on("tab-group-menu", (menu) => {
        const obj = this._getFilesFromTabGroup(
          this.app.workspace.getLeaf(false)
        );
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Add props from all tabs")
            .onClick(() => this.createPropModal(obj));
        });
      })
    );

    this.addCommand({
      id: "remove-props-from-tab-group",
      name: "Remove props from tabs in active tab group",
      callback: async () => {
        const files = this._getFilesFromTabGroup(
          this.app.workspace.getLeaf(false)
        );
        if (!files || !files.length) {
          new Notice(
            "No open tabs in the active tab group to remove properties from.",
            4000
          );
          return;
        }
        await this.createRemoveModal(files);
      },
    });

    this.registerEvent(
      this.app.workspace.on("tab-group-menu", (menu) => {
        const obj = this._getFilesFromTabGroup(
          this.app.workspace.getLeaf(false)
        );
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Remove props from all tabs")
            .onClick(() => this.createRemoveModal(obj));
        });
      })
    );

    /** Add menu item on multi-file right-click to add properties to all notes in selection.
     * PropModal returns Props on submit, which is then passed to searchThroughFiles via callback.
     */
    this.registerEvent(
      this.app.workspace.on("files-menu", (menu, nodes) => {
        let obj = nodes as TFile[];
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Add props to selected files")
            .onClick(() => this.createPropModal(obj));
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("files-menu", (menu, nodes) => {
        let obj = nodes as TFile[];
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle("Remove props from selected files")
            .onClick(async () => this.createRemoveModal(obj));
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("search:results-menu", (menu, leaf: any) => {
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
      this.app.workspace.on("search:results-menu", (menu, leaf: any) => {
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
        names = await addPropToSet(
          this.app.fileManager.processFrontMatter.bind(this.app.fileManager),
          names,
          obj
        );
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
        names = await addPropToSet(
          this.app.fileManager.processFrontMatter.bind(this.app.fileManager),
          names,
          file
        );
      }
    }
    return [...names];
  }

  async searchFolders(folder: TFolder, callback: (file: TFile) => any) {
    for (let obj of folder.children) {
      if (obj instanceof TFolder) {
        if (this.settings.recursive) {
          await this.searchFolders(obj, callback);
        }
      }
      if (obj instanceof TFile && obj.extension === "md") {
        await callback(obj);
      }
    }
  }

  async searchFiles(files: TAbstractFile[], callback: (file: TFile) => any) {
    for (let file of files) {
      if (file instanceof TFile && file.extension === "md") {
        await callback(file);
      }
    }
  }

  getFilesFromSearch(leaf: any) {
    let files: TFile[] = [];
    leaf.dom.vChildren.children.forEach((e: any) => {
      files.push(e.file);
    });
    return files;
  }

  async createPropModal(iterable: TFile[] | TFolder) {
    let iterateFunc;
    let files: TFile[] = [];
    if (iterable instanceof TFolder) {
      iterateFunc = async (props: Map<string, any>) =>
        await this.searchFolders(iterable, this.addPropsCallback(props));
    } else {
      files = iterable;
      iterateFunc = async (props: Map<string, any>) =>
        await this.searchFiles(files, this.addPropsCallback(props));
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

    new PropModal(
      this.app,
      iterateFunc,
      this.settings.overwrite,
      this.settings.delimiter,
      defaultProps,
      this.changeOverwrite.bind(this)
    ).open();
  }

  async createRemoveModal(iterable: TFile[] | TFolder) {
    let names;
    let iterateFunc;

    if (iterable instanceof TFolder) {
      names = await this.getPropsFromFolder(iterable, new Set());
      iterateFunc = async (props: string[]) =>
        await this.searchFolders(iterable, this.removePropsCallback(props));
    } else {
      names = await this.getPropsFromFiles(iterable, new Set());
      iterateFunc = async (props: string[]) =>
        await this.searchFiles(iterable, this.removePropsCallback(props));
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

  addPropsCallback(props: any) {
    return async (file: TFile) => {
      await addProperties(
        this.app.fileManager.processFrontMatter.bind(this.app.fileManager),
        file,
        props,
        this.settings.overwrite,
        this.app.metadataCache.getAllPropertyInfos()
      );
    };
  }

  removePropsCallback(props: any) {
    return async (file: TFile) => {
      await removeProperties(
        this.app.fileManager.processFrontMatter.bind(this.app.fileManager),
        file,
        props
      );
    };
  }
}
