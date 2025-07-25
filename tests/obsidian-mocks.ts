// tests/obsidian-mocks.ts

// This file mocks the 'obsidian' module.
// It is crucial for testing plugins without needing a live Obsidian instance.

// Extend the global Array prototype for the 'remove' method used in the plugin
declare global {
    interface Array<T> {
        remove(item: T): void;
    }
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function<T>(item: T): void {
        const index = this.indexOf(item);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
}


// Mock TFile to include frontmatter for testing metadata changes
declare module 'obsidian' {
    interface TFile {
        frontmatter: any;
    }
}

// --- Mock Classes ---

export class MockApp {
    workspace: MockWorkspace;
    vault: MockVault;
    fileManager: MockFileManager;
    commands: any[] = [];
    modal: any; // To hold the last opened modal instance for testing

    constructor() {
        this.workspace = new MockWorkspace(this);
        this.vault = new MockVault();
        this.fileManager = new MockFileManager();
    }

    addCommand(command: any) {
        this.commands.push(command);
    }
}

export class MockWorkspace {
    app: MockApp;
    leaves: Map<string, MockWorkspaceLeaf> = new Map();
    activeLeaf: MockWorkspaceLeaf | null = null;
    roots: MockWorkspaceSplit[] = [];

    constructor(app: MockApp) {
        this.app = app;
    }

    getLeafById(id: string): MockWorkspaceLeaf | null {
        return this;leaves.get(id) || null;
    }

    getLeavesOfType(type: string): MockWorkspaceLeaf[] {
        const result: MockWorkspaceLeaf[] = [];
        this.leaves.forEach(leaf => {
            if (leaf.view.getViewType() === type) {
                result.push(leaf);
            }
        });
        return result;
    }

    iterateAllLeaves(callback: (leaf: MockWorkspaceLeaf) => void) {
        this.leaves.forEach(leaf => callback(leaf));
    }

    addLeaf(leaf: MockWorkspaceLeaf, root?: MockWorkspaceSplit) {
        this.leaves.set(leaf.id, leaf);
        if (root) {
            if (!this.roots.includes(root)) {
                this.roots.push(root);
            }
            root.addLeaf(leaf);
        }
        this.activeLeaf = leaf;
    }

    on() {
        // No-op for tests
    }
}

export class MockWorkspaceSplit {
    leaves: MockWorkspaceLeaf[] = [];
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    addLeaf(leaf: MockWorkspaceLeaf) {
        this.leaves.push(leaf);
        leaf.setRoot(this);
    }

    getLeaves(): MockWorkspaceLeaf[] {
        return this;leaves;
    }
}

export class MockVault {
    files: Map<string, any> = new Map();

    getAbstractFileByPath(path: string): any | null {
        return this;files.get(path) || null;
    }

    create(path: string, data: string): Promise<any> {
        const file = { path, name: path.split('/').pop(), frontmatter: {} };
        this.files.set(path, file);
        return Promise.resolve(file);
    }
}

export class MockFileManager {
    processFrontMatter(file: any, fn: (fm: any) => void): Promise<void> {
        const frontmatter = file.frontmatter || {};
        fn(frontmatter);
        file.frontmatter = frontmatter;
        return Promise.resolve();
    }
}

export class MockWorkspaceLeaf {
    id: string;
    view: MockMarkdownView;
    parent: any;
    root: MockWorkspaceSplit | null = null;
    openFile: () => Promise<void>;
    open: () => Promise<void>;
    setViewState: () => Promise<void>;
    isDeferred: boolean;
    loadIfDeferred: () => Promise<void>;
    getEphemeralState: () => any;
    setEphemeralState: (state: any) => void;
    togglePinned: () => void;
    getIcon: () => string;
    getDisplayText: () => string;
    on: (name: string, callback: (...data: any[]) => any) => void;
    off: (name: string, callback: (...data: any[]) => any) => void;
    offref: (ref: any) => void;
    trigger: (name: string, ...data: any[]) => void;
    detach: () => void;
    setGroup: (group: string) => void;
    getGroup: () => string;
    setPinned: (pinned: boolean) => void;
    getPinned: () => boolean;
    rebuildView: () => void;
    isEmpty: () => boolean;
    tabHeaderEl: HTMLElement;
    containerEl: HTMLElement;


    constructor(id: string, file: any, app: MockApp) {
        this.id = id;
        this.view = new MockMarkdownView(file);
        this.parent = { children: Array.from(app.workspace.leaves.values()) };
        this.openFile = async () => {};
        this.open = async () => {};
        this.setViewState = async () => {};
        this.isDeferred = false;
        this.loadIfDeferred = async () => {};
        this.getEphemeralState = () => ({});
        this.setEphemeralState = () => {};
        this.togglePinned = () => {};
        this.getIcon = () => '';
        this.getDisplayText = () => '';
        this.on = () => {};
        this.off = () => {};
        this.offref = () => {};
        this.trigger = () => {};
        this.detach = () => {};
        this.setGroup = () => {};
        this.getGroup = () => '';
        this.setPinned = () => {};
        this.getPinned = () => false;
        this.rebuildView = () => {};
        this.isEmpty = () => false;
        this.tabHeaderEl = document.createElement('div');
        this.containerEl = document.createElement('div');
    }

    getViewState() {
        return {
            type: 'markdown',
            state: { file: this.view.file.path },
        };
    }

    getRoot() {
        return this;root;
    }

    setRoot(root: MockWorkspaceSplit) {
        this.root = root;
    }

    getContainer() {
        return this;root;
    }
}

export class MockMarkdownView {
    file: any;
    containerEl: HTMLElement;

    constructor(file: any) {
        this.file = file;
        this.containerEl = document.createElement('div');
        const header = document.createElement('div');
        header.className = 'workspace-tab-header';
        header.setAttribute('data-leaf-id', `leaf-${Math.random()}`);
        this.containerEl.appendChild(header);
    }

    getViewType() {
        return 'markdown';
    }
}

export class MockModal {
    app: MockApp;
    contentEl: HTMLElement;
    titleEl: HTMLElement;
    onSubmit: (...args: any[]) => void;

    constructor(app: MockApp, onSubmit: (...args: any[]) => void) {
        this.app = app;
        this.onSubmit = onSubmit;
        this.contentEl = document.createElement('div');
        this.titleEl = document.createElement('div');
        (this.titleEl as any).createEl = (tag: string, options: any) => {
            const el = document.createElement(tag);
            if (options.text) {
                el.textContent = options.text;
            }
            return el;
        };
        // Add the setText method to the contentEl
        (this.contentEl as any).setText = (text: string) => {
            this.contentEl.textContent = text;
        };
        // Add the empty method to the contentEl
        (this.contentEl as any).empty = () => {
            this.contentEl.innerHTML = '';
        };
    }

    open() {
        this.app.modal = this;
    }

    close() {
        this.app.modal = null;
    }
}

export class MockSetting {
    containerEl: HTMLElement;
    private name: string = '';
    private text: string = '';
    private buttonText: string = '';
    private cta: boolean = false;
    private onClickCallback: (() => void) | null = null;
    private onChangeCallback: ((value: string) => void) | null = null;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
    }

    setName(name: string) {
        this.name = name;
        const nameEl = document.createElement('div');
        nameEl.textContent = name;
        this.containerEl.appendChild(nameEl);
        return this;
    }

    addText(callback: (text: any) => void) {
        const textInput = document.createElement('input');
        textInput.type = 'text';
        this.containerEl.appendChild(textInput);
        callback({
            onChange: (cb: (value: string) => void) => {
                this.onChangeCallback = cb;
                textInput.addEventListener('change', (e) => {
                    this.text = (e.target as HTMLInputElement).value;
                    cb(this.text);
                });
                return this;
            }
        });
        return this;
    }

    addButton(callback: (button: any) => void) {
        const button = document.createElement('button');
        this.containerEl.appendChild(button);

        const buttonProxy = {
            setButtonText: (text: string) => {
                this.buttonText = text;
                button.textContent = text;
                return buttonProxy; // Return the proxy object for chaining
            },
            setCta: () => {
                this.cta = true;
                button.classList.add('cta');
                return buttonProxy; // Return the proxy object for chaining
            },
            onClick: (cb: () => void) => {
                this.onClickCallback = cb;
                button.addEventListener('click', cb);
                return buttonProxy; // Return the proxy object for chaining
            }
        };

        callback(buttonProxy);
        return this;
    }
}

export class MockPlugin {
    app: MockApp;
    manifest: any;

    constructor(app: MockApp, manifest: any) {
        this.app = app;
        this.manifest = manifest;
    }

    addCommand(command: any) {
        this.app.addCommand(command);
    }

    registerDomEvent(element: any, event: any, callback: any) {
        // No-op for tests
    }

    async loadData() {
        return {};
    }

    addSettingTab() {
        // No-op for tests
    }

    registerEvent() {
        // No-op for tests
    }
}

export class Notice {
    constructor(message: string) {
        console.log(message);
    }
}

export const Plugin = MockPlugin;
export class PluginSettingTab {}
export class Menu {}
export class TAbstractFile {}
