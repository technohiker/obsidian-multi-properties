import { describe, it, expect, vi } from "vitest";
import { SettingTab } from "../src/SettingTab";
import { App, PluginSettingTab, Setting } from "obsidian";
import MultiPropPlugin from "../src/main";

// Mock the Obsidian API
vi.mock("obsidian", () => {
  const original = vi.importActual("obsidian");
  return {
    ...original,
    PluginSettingTab: vi.fn(),
    Setting: vi.fn(() => ({
      setName: vi.fn().mockReturnThis(),
      setDesc: vi.fn().mockReturnThis(),
      addToggle: vi.fn().mockReturnThis(),
      addText: vi.fn().mockReturnThis(),
    })),
  };
});

describe("SettingTab", () => {
  it("should create the settings UI", () => {
    const app = {} as App;
    const plugin = {
      settings: {
        overwrite: false,
        recursive: false,
        delimiter: ",",
        defaultPropPath: "",
      },
      saveSettings: vi.fn(),
    } as unknown as MultiPropPlugin;

    const settingTab = new SettingTab(app, plugin);
    settingTab.containerEl = { empty: vi.fn() } as any;
    settingTab.display();

    expect(settingTab.containerEl.empty).toHaveBeenCalledOnce();
    expect(Setting).toHaveBeenCalledTimes(4);
  });
});
