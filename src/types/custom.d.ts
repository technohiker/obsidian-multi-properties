//Adding files-menu and search:results-menu method to Obsidian's type file.
//These methods exist in Obsidian's code, but are not in the public API.
//This file will allow TypeScript to run the methods without issue.
import {} from "obsidian";

declare module "obsidian" {
  interface Workspace {
    on(
      name: "files-menu",
      callback: (
        menu: Menu,
        file: TAbstractFile[],
        source: string,
        leaf?: WorkspaceLeaf
      ) => any,
      ctx?: any
    ): EventRef;
    on(
      name: "search:results-menu",
      callback: (menu: Menu, leaf: any) => any,
      ctx?: any
    ): EventRef;
  }
  interface MetadataCache {
    getAllPropertyInfos(): PropertyInfos;
  }
}

interface PropertyInfos {
  [name: string]: Property;
}

interface Property {
  name: string;
  widget: PropertyTypes;
  occurrences: number;
}

type PropertyTypes =
  | "aliases"
  | "tags"
  | "checkbox"
  | "date"
  | "datetime"
  | "multitext"
  | "number"
  | "text";
