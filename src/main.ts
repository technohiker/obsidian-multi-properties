import {
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
import { type MultiPropSettings, SettingTab } from "./SettingTab";
import { RemoveModal } from "./RemoveModal";
import { addProperties, addPropToSet, removeProperties } from "./frontmatter";
import type { Property, PropertyTypes } from "./types/custom";
import { getTranslation, detectLocale, getStoredLocale, format } from "./i18n";
import type en from "./i18n/en";

const defaultSettings: MultiPropSettings = {
  alterProp: "ignore",
  recursive: true,
  delimiter: ",",
  defaultPropPath: "",
};

export interface NewPropData {
  type: string;
  data: string | string[] | null;
  alterProp: MultiPropSettings["alterProp"];
  delimiter: string;
}

export default class MultiPropPlugin extends Plugin {
  settings: MultiPropSettings;
  t: typeof en;
  currentLocale: string;

  async loadSettings() {
    this.settings = Object.assign({}, defaultSettings, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async changeAlterProp(value: MultiPropSettings["alterProp"]) {
    this.settings.alterProp = value;
    await this.saveSettings();
  }

  initI18n() {
    const storedLocale = getStoredLocale();
    this.currentLocale = storedLocale || detectLocale();
    this.t = getTranslation(this.currentLocale);
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
    this.initI18n();
    this.addSettingTab(new SettingTab(this.app, this));

    // All commands for single notes & folders.
    this.addCommand({
      id: "add-props-to-current-note",
      name: this.t.addPropsToCurrentNote,
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new Notice(this.t.noActiveFileToAdd, 4000);
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
          title = this.t.addPropsToFile;
        } else {
          obj = node as TFolder;
          title = this.t.addPropsToFolder;
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
      name: this.t.removePropsFromCurrentNote,
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new Notice(this.t.noActiveFileToRemove, 4000);
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
          title = this.t.removePropsFromFile;
        } else {
          obj = node as TFolder;
          title = this.t.removePropsFromFolder;
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
      name: this.t.addPropsToTabGroup,
      callback: async () => {
        const files = this._getFilesFromTabGroup(
          this.app.workspace.getMostRecentLeaf()
        );
        if (!files || !files.length) {
          new Notice(
            this.t.noOpenTabsToAdd,
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
          this.app.workspace.getMostRecentLeaf()
        );
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle(this.t.addPropsFromAllTabs)
            .onClick(() => this.createPropModal(obj));
        });
      })
    );

    this.addCommand({
      id: "remove-props-from-tab-group",
      name: this.t.removePropsFromTabGroup,
      callback: async () => {
        const files = this._getFilesFromTabGroup(
          this.app.workspace.getMostRecentLeaf()
        );
        if (!files || !files.length) {
          new Notice(
            this.t.noOpenTabsToRemove,
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
          this.app.workspace.getMostRecentLeaf()
        );
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle(this.t.removePropsFromAllTabs)
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
            .setTitle(this.t.addPropsToSelectedFiles)
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
            .setTitle(this.t.removePropsFromSelectedFiles)
            .onClick(async () => this.createRemoveModal(obj));
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("search:results-menu", (menu, leaf: any) => {
        menu.addItem((item) => {
          item
            .setIcon("archive")
            .setTitle(this.t.addPropsToSearchResults)
            .onClick(() => {
              let files = this.getFilesFromSearch(leaf);
              if (!files.length) {
                new Notice(this.t.noFilesToAdd, 4000);
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
            .setTitle(this.t.removePropsFromSearchResults)
            .onClick(async () => {
              let files = this.getFilesFromSearch(leaf);
              if (!files.length) {
                new Notice(this.t.noFilesToRemove, 4000);
                return;
              }
              this.createRemoveModal(files);
            });
        });
      })
    );
  }

  async getPropsFromFolder(
    iterable: TFolder | TAbstractFile[],
    names: Set<string>
  ) {
    let objs: TAbstractFile[] =
      iterable instanceof TFolder ? iterable.children : iterable;
    for (let obj of objs) {
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

  /** Iterates through all files in a folder and runs callback on each file. */
  async searchFolders(
    iterable: TFolder | TAbstractFile[],
    callback: (file: TFile) => Promise<any>
  ) {
    let objs: TAbstractFile[] =
      iterable instanceof TFolder ? iterable.children : iterable;

    for (let obj of objs) {
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
    const allFiles: TFile[] = [];
    this.searchFolders(iterable, async (f) => allFiles.push(f));
    iterateFunc = async (props: Map<string, any>) =>
      this.searchFolders(
        iterable,
        await this.addPropsCallback(props, allFiles.length)
      );

    let defaultProps: { name: string; value: any; type: PropertyTypes }[];
    defaultProps = this.loadDefaultProps();
    const allProps = this.getAllUsedProperties();

    new PropModal(
      this.app,
      iterateFunc,
      this.settings.alterProp,
      this.settings.delimiter,
      defaultProps,
      this.changeAlterProp.bind(this),
      allProps,
      this.t
    ).open();
  }

  getAllUsedProperties(): Property[] {
    const allProps = this.app.metadataCache.getAllPropertyInfos();
    return Object.values(allProps).sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    ); //PropertyInfos type doesn't match what is actually being pulled.  Notify Obsidian devs.
  }

  /** Create modal for removing properties.
   * Will create a different callback function depending on whether files or a folder is used. */
  async createRemoveModal(iterable: TAbstractFile[] | TFolder) {
    let names;
    let iterateFunc;

    names = await this.getPropsFromFolder(iterable, new Set());
    const allFiles: TFile[] = [];
    this.searchFolders(iterable, async (f) => allFiles.push(f));
    iterateFunc = (props: string[]) =>
      this.searchFolders(
        iterable,
        this.removePropsCallback(props, allFiles.length)
      );

    if (names.length === 0) {
      new Notice(this.t.noPropertiesToRemove, 4000);
      return;
    }

    const sortedNames = [...names].sort((a, b) =>
      a.toLowerCase() > b.toLowerCase() ? 1 : -1
    );

    new RemoveModal(this.app, sortedNames, iterateFunc, this.t).open();
  }

  /** Read through a given file and get name/value of props.
   *  Revised from https://forum.obsidian.md/t/how-to-programmatically-access-a-files-properties-types/77826/4.
   */
  readYamlProperties(file: TFile) {
    const metadata = this.app.metadataCache.getFileCache(file);
    const frontmatter = metadata?.frontmatter;

    if (!frontmatter) {
      new Notice(this.t.notValidPropsTemplate, 4000);
      return;
    }

    const allPropsWithType = this.app.metadataCache.getAllPropertyInfos();

    let result: { name: string; value: any; type: PropertyTypes }[] = [];

    for (let [key, value] of Object.entries(frontmatter)) {
      const keyLower = key.toLowerCase();
      const obj = {
        name: key,
        value: value,
        type: allPropsWithType[keyLower].widget,
      };

      result.push(obj);
    }
    return result;
  }

  loadDefaultProps() {
    if (this.settings.defaultPropPath) {
      try {
        const file = this.app.vault.getAbstractFileByPath(
          `${this.settings.defaultPropPath}.md`
        );
        let tmp = this.readYamlProperties(file as TFile);
        if (tmp === undefined) throw Error("Undefined path.");
        return tmp;
      } catch (e) {
        new Notice(
          `${e}.  ${this.t.checkDefaultPropsPath}`,
          10000
        );
      }
    }
    return [{ name: "", value: "" as any, type: "text" as PropertyTypes }];
  }

  async addPropsCallback(props: Map<string, NewPropData>, totalFiles: number) {
    const statusBarItem = this.addStatusBarItem();
    let count = 0;

    return async (file: TFile) => {
      await addProperties(
        this.app.fileManager.processFrontMatter.bind(this.app.fileManager),
        file,
        props,
        this.settings.alterProp,
        this.app.metadataCache.getAllPropertyInfos()
      );

      count++;
      statusBarItem.setText(
        format(this.t.addedPropsTo, { count, total: totalFiles })
      );

      if (count === totalFiles) {
        setTimeout(() => {
          statusBarItem.remove();
        }, 5000);
      }
    };
  }

  removePropsCallback(props: string[], totalFiles: number) {
    const statusBarItem = this.addStatusBarItem();
    let count = 0;

    return async (file: TFile) => {
      await removeProperties(
        this.app.fileManager.processFrontMatter.bind(this.app.fileManager),
        file,
        props
      );

      count++;
      statusBarItem.setText(
        format(this.t.removedPropsFrom, { count, total: totalFiles })
      );

      if (count === totalFiles) {
        setTimeout(() => {
          statusBarItem.remove();
        }, 5000);
      }
    };
  }
}
