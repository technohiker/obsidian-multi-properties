import {
	Workspace,
	WorkspaceLeaf,
	Menu,
	TAbstractFile,
	EventRef,
} from "obsidian";

declare module "./events" {
	interface Workspace {
		on(
			name: "file-menu",
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
/**
 * Triggered when the user open the context menu of multiple files.
 * @public
 */
// on(name: 'files-menu',callback: (menu: Menu, file: TAbstractFile[],source: string, leaf?: WorkspaceLeaf) => any, ctx?: any): EventRef;

Workspace.prototype.on;
