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
	}
}
