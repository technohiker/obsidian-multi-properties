//Adding files-menu method to Obsidian's type file.
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
		getAllPropertyInfos(): PropertyInfos
	}
}

interface PropertyInfos {
	[name: string] : Property
}

interface Property{
	name: string,
	type: PropertyTypes,
	count: number
}

type PropertyTypes =  "aliases" | "checkbox" | "date" | "datetime" | "multitext" | "number" | "tags" | "text"