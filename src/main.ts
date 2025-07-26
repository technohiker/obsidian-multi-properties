import { Menu, Notice, Plugin, TAbstractFile, TFile, TFolder, FileView } from "obsidian";
import { PropModal } from "./AddPropModal";
import { MultiPropSettings, SettingTab } from "./SettingTab";
import { RemoveModal } from "./RemoveModal";
import { addProperties, addPropToSet, removeProperties } from "./frontmatter";
import { PropertyTypes } from "./types/custom";

declare const process: any;

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

  private _getFilesFromActiveWindow(): TFile[] | null {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (!activeLeaf) {
      new Notice("No active tab found.", 4000);
      return null;
    }
    const activeRoot = activeLeaf.getRoot();
    const files: TFile[] = [];
    const fileSet = new Set<string>();

    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.getRoot() === activeRoot && leaf.view instanceof FileView) {
        const file = leaf.view.file;
        if (file && !fileSet.has(file.path)) {
          files.push(file);
          fileSet.add(file.path);
        }
      }
    });

    return files;
  }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new SettingTab(this.app, this));

    if (process.env.DEV_BUILD) {
      this.addCommand({
        id: "run-live-integration-test",
        name: "Run Live Integration Test (DEV)",
        callback: async () => {
          console.log("--- Starting Live Integration Test ---");

          const pluginId = 'multi-properties';
          // @ts-ignore - Using internal plugins object for test
          const plugin = this.app.plugins.plugins[pluginId];

          if (!plugin) {
            console.error("Plugin not found. Is it enabled?");
            return;
          }

          const testNotePath = 'test-note.md';
          const file = this.app.vault.getAbstractFileByPath(testNotePath);
          if (!(file instanceof TFile)) {
              console.error(`Could not find '${testNotePath}' or it is not a TFile. Make sure the test vault is initialized.`);
              return;
          }

          // --- Test Case 1: Add a new property ---
          console.log("Running Test Case 1: Add Property");
          const propToAdd = { name: 'live-test-prop', type: 'number', value: 999 };
          
          const originalCreatePropModal = plugin.createPropModal;
          plugin.createPropModal = (iterable: TAbstractFile[] | TFolder) => {
              const props = new Map();
              props.set(propToAdd.name, { type: propToAdd.type, data: propToAdd.value });
              if (iterable instanceof TFolder) {
                plugin.searchFolders(iterable, plugin.addPropsCallback(props));
              } else {
                plugin.searchFiles(iterable, plugin.addPropsCallback(props));
              }
          };

          if (this.app.workspace.activeLeaf) {
            this.app.workspace.activeLeaf.openFile(file);
          }
          // @ts-ignore - Using internal commands object for test
          this.app.commands.executeCommandById('multi-properties:add-props-to-current-note');
          
          plugin.createPropModal = originalCreatePropModal;

          await new Promise(resolve => setTimeout(resolve, 100)); 
          let metadata = this.app.metadataCache.getFileCache(file);
          if (metadata?.frontmatter?.[propToAdd.name] === propToAdd.value) {
            console.log("  ✅ SUCCESS: Property was added correctly.");
          } else {
            console.error("  ❌ FAILED: Property was not added.", metadata?.frontmatter);
          }

          // --- Test Case 2: Remove the property ---
          console.log("Running Test Case 2: Remove Property");

          const originalCreateRemoveModal = plugin.createRemoveModal;
          plugin.createRemoveModal = (iterable: TAbstractFile[] | TFolder) => {
              if (iterable instanceof TFolder) {
                plugin.searchFolders(iterable, plugin.removePropsCallback([propToAdd.name]));
              } else {
                plugin.searchFiles(iterable, plugin.removePropsCallback([propToAdd.name]));
              }
          };

          // @ts-ignore - Using internal commands object for test
          this.app.commands.executeCommandById('multi-properties:remove-props-from-current-note');
          plugin.createRemoveModal = originalCreateRemoveModal;

          await new Promise(resolve => setTimeout(resolve, 100));
          metadata = this.app.metadataCache.getFileCache(file);
          if (metadata?.frontmatter?.[propToAdd.name] === undefined) {
            console.log("  ✅ SUCCESS: Property was removed correctly.");
          } else {
            console.error("  ❌ FAILED: Property was not removed.", metadata?.frontmatter);
          }

          console.log("--- Live Integration Test Complete ---");
        }
      });
    }

    this.addCommand({
      id: "add-props-to-current-note",
      name: "Add props to current note",
      callback: () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new Notice("No active file to add properties to.", 4000);
          return;
        }
        this.createPropModal([file]);
      },
    });

    this.addCommand({
      id: "remove-props-from-current-note",
      name: "Remove props from current note",
      callback: () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new Notice("No active file to remove properties from.", 4000);
          return;
        }
        this.createRemoveModal([file]);
      },
    });

    this.addCommand({
      id: "add-props-to-open-tabs",
      name: "Add props to open tabs",
      callback: () => {
        const files = this._getFilesFromActiveWindow();
        if (!files || !files.length) {
          new Notice("No open tabs to add properties to.", 4000);
          return;
        }
        this.createPropModal(files);
      },
    });

    this.addCommand({
      id: "remove-props-from-open-tabs",
      name: "Remove props from open tabs",
      callback: () => {
        const files = this._getFilesFromActiveWindow();
        if (!files || !files.length) {
          new Notice("No open tabs to remove properties from.", 4000);
          return;
        }
        this.createRemoveModal(files);
      },
    });

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
        names = await addPropToSet(this.app.fileManager.processFrontMatter.bind(this.app.fileManager), names, obj);
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
        names = await addPropToSet(this.app.fileManager.processFrontMatter.bind(this.app.fileManager), names, file);
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

    new PropModal(
      this.app,
      iterateFunc,
      this.settings.overwrite,
      this.settings.delimiter,
      defaultProps,
      this.changeOverwrite.bind(this)
    ).open();
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
      addProperties(this.app.fileManager.processFrontMatter.bind(this.app.fileManager), file, props, this.settings.overwrite, this.app.metadataCache.getAllPropertyInfos());
    };
  }

  /** Callback function to run removeProperties inside iterative functions. */
  removePropsCallback(props: any) {
    return (file: TFile) => {
      removeProperties(this.app.fileManager.processFrontMatter.bind(this.app.fileManager), file, props);
    };
  }
}