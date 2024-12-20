import { WxtStorageItem } from "wxt/storage";
import { snapshotTabs, UUID, type TabV2 } from "./data";
import { CompleteOpsItem, LastSnapshotDateItem, LastSnapshotHashItem, TabCountItem, TabItem, TSyncInstance } from "./storage";

export type TOption = TTextOption | TCheckOption | TMultiOption | TButtonOption | TKeyOption | TInstanceOption;

type TBasicOption = {
  name: string;
  label: string;
  description: string[];
  reset: boolean;
  chrome?: boolean;
  firefox?: boolean;
};

export type TTextOption = TBasicOption & {
  type: "text";
  placeholder?: string;
  pattern?: RegExp;
  item: WxtStorageItem<string, Record<string, string>>;
};

export type TCheckOption = TBasicOption & {
  type: "check";
  item: WxtStorageItem<boolean, Record<string, boolean>>;
};

export type TMultiOption<T = MultiType> = TBasicOption & {
  type: "multi";
  options: readonly T[];
  item: WxtStorageItem<T, Record<string, T>>;
};

export type TButtonOption = TBasicOption & {
  type: "button";
  button: string;
  danger: boolean;
  onPress: Function;
};

export type TKeyOption = TBasicOption & {
  type: "key";
  gen: Function;
  item: WxtStorageItem<UUID, Record<string, UUID>>;
};

export type TInstanceOption = TBasicOption & {
  type: "instance_list";
  reset: false;
  item: WxtStorageItem<TSyncInstance[], Record<string, TSyncInstance[]>>;
};

const snapshotFrequencyOptions = ["never", "only_funnel", "every_change", "hourly", "daily", "weekly", "monthly"];
const currentThemeOptions = ["one_dark", "one_light", "kanagawa_wave", "kanagawa_dragon", "kanagawa_lotus", "gruvbox_dark", "gruvbox_light", "catpuccin_latte", "catpuccin_frappe", "catpuccin_macchiato", "catpuccin_mocha", "tokyonight_day", "tokyonight_moon", "tokyonight_night", "tokyonight_storm", "dracula", "nord", "t_lollipop"];
type MultiType = typeof snapshotFrequencyOptions[number] | typeof currentThemeOptions[number];

export const Options = {
  SNAPSHOT_FREQUENCY: {
    type: "multi",
    name: "snapshot_frequency",
    label: "options.snapshot_frequency.label",
    item: storage.defineItem("local:snapshot_frequency", {
      init: () => "never",
      fallback: "never",
    }),
    reset: true,
    options: snapshotFrequencyOptions,
    description: [
      "options.snapshot_frequency.description.A",
      "options.snapshot_frequency.description.B",
      "options.snapshot_frequency.description.C",
    ]
  } as TMultiOption<typeof snapshotFrequencyOptions[number]>,
  REMOVE_TABS_RESTORED: {
    type: "check",
    name: "remove_tabs_restored",
    label: "options.remove_tabs_restored.label",
    item: storage.defineItem("sync:remove_tabs_restored", {
      init: () => false,
      fallback: false,
    }),
    reset: true,
    description: [
      "options.remove_tabs_restored.description.A",
    ],
  } as TCheckOption,
  REMOVE_TABS_FUNNELLED: {
    type: "check",
    name: "remove_tabs_funnelled",
    label: "options.remove_tabs_funnelled.label",
    item: storage.defineItem("sync:remove_tabs_funnelled", {
      init: () => true,
      fallback: true,
    }),
    reset: true,
    description: [
      "options.remove_tabs_funnelled.description.A",
    ],
  } as TCheckOption,
  IGNORE_DUPLICATE_TABS: {
    type: "check",
    name: "ignore_duplicate_tabs",
    label: "options.ignore_duplicate_tabs.label",
    item: storage.defineItem("sync:ignore_duplicate_tabs", {
      init: () => false,
      fallback: false,
    }),
    reset: true,
    description: [
      "options.ignore_duplicate_tabs.description.A",
    ],
  } as TCheckOption,
  SWITCH_TAB_RESTORED: {
    type: "check",
    name: "switch_tab_restored",
    label: "options.switch_tab_restored.label",
    item: storage.defineItem("sync:switch_tab_restored", {
      init: () => false,
      fallback: false,
    }),
    reset: true,
    description: [
      "options.switch_tab_restored.description.A",
    ],
  } satisfies TCheckOption,
  FUNNEL_PINNED_TABS: {
    type: "check",
    name: "funnel_pinned_tabs",
    label: "options.funnel_pinned_tabs.label",
    item: storage.defineItem("sync:funnel_pinned_tabs", {
      init: () => false,
      fallback: false,
    }),
    reset: true,
    description: [
      "options.funnel_pinned_tabs.description.A",
    ],
  } satisfies TCheckOption,
  SNAPSHOT_LOCATION: {
    type: "text",
    name: "snapshot_location",
    label: "options.snapshot_location.label",
    item: storage.defineItem("sync:snapshot_location", {
      init: () => "tab-funnel",
      fallback: "tab-funnel",
    }),
    reset: true,
    placeholder: "tab-funnel",
    description: [
      "options.snapshot_location.description.A",
      "options.snapshot_location.description.B",
    ],
    pattern: /[^a-zA-Z0-9\-]/g,
  } satisfies TTextOption,
  FONT_OVERRIDE: {
    type: "text",
    name: "font_override",
    label: "options.font_override.label",
    item: storage.defineItem("sync:font_override", {
      init: () => "",
      fallback: "",
    }),
    reset: true,
    placeholder: "Arial, Helvetica, monospace",
    description: [
      "options.font_override.description.A",
      "options.font_override.description.B",
      "options.font_override.description.C"
    ]
  } satisfies TTextOption,
  CURRENT_THEME: {
    type: "multi",
    name: "current_theme",
    label: "options.current_theme.label",
    item: storage.defineItem("sync:current_theme", {
      init: () => "kanagawa_wave",
      fallback: "kanagawa_wave",
    }),
    reset: true,
    options: currentThemeOptions,
    description: [
      "options.current_theme.description.A"
    ]
  } satisfies TMultiOption<typeof currentThemeOptions[number]>,
  RESTORE_AS_PINNED: {
    type: "check",
    name: "restore_as_pinned",
    label: "options.restore_as_pinned.label",
    item: storage.defineItem("sync:restore_as_pinned", {
      init: () => true,
      fallback: true
    }),
    reset: true,
    description: [
      "options.restore_as_pinned.description.A"
    ]
  } satisfies TCheckOption,
  DANGER_RESET_TO_DEFAULT: {
    type: "button",
    name: "reset_options_to_default",
    label: "options.danger.resetOptions.label",
    button: "options.danger.resetOptions.button",
    description: [
      "options.danger.resetOptions.description.A"
    ],
    reset: false,
    onPress: () => {
      Object.entries(Options).forEach(([k, v]) => {
        if (v.reset && v.item) {
          v.item.removeValue();
        }
      });
    },
    danger: true
  } satisfies TButtonOption,
  DANGER_REMOVE_DUPLICATES: {
    type: "button",
    name: "remove_duplicates",
    label: "options.danger.removeAllDuplicates.label",
    button: "options.danger.removeAllDuplicates.button",
    description: [
      "options.danger.removeAllDuplicates.description.A",
      "options.danger.removeAllDuplicates.description.B"
    ],
    reset: false,
    onPress: async () => {
      if (!confirm(i18n.t("options.danger.removeAllDuplicates.confirm"))) return;
      await snapshotTabs();

      const tabs = await TabItem.getValue();
      const tabMap = new Map<string, TabV2>();
      tabs.forEach((tab: TabV2) => {
        tabMap.set(tab.url, tab);
      });
      const filteredTabs: TabV2[] = [];
      tabMap.forEach((tab: TabV2, url: string) => {
        filteredTabs.push(tab);
      });

      TabItem.setValue(filteredTabs);
      TabCountItem.setValue(filteredTabs.length);
    },
    danger: true
  } satisfies TButtonOption,
  DANGER_CLEAR_TABS: {
    type: "button",
    name: "danger_clear_tabs",
    label: "options.danger.clearAllTabs.label",
    button: "options.danger.clearAllTabs.button",
    description: [
      "options.danger.clearAllTabs.description.A",
      "options.danger.clearAllTabs.description.B"
    ],
    reset: false,
    onPress: async () => {
      if (!confirm(i18n.t("options.danger.clearAllTabs.confirm"))) return;
      await snapshotTabs();
      await TabCountItem.setValue(0);
      await TabItem.setValue([]);
    },
    danger: true
  } satisfies TButtonOption,
  DANGER_CLEAR_SNAPSHOT_DATE: {
    type: "button",
    name: "danger_clear_snapshots",
    label: "options.danger.clearSnapshotDate.label",
    button: "options.danger.clearSnapshotDate.button",
    description: [
      "options.danger.clearSnapshotDate.description.A"
    ],
    reset: false,
    onPress: async () => {
      if (!confirm(i18n.t("options.danger.clearSnapshotDate.confirm"))) return;
      await LastSnapshotHashItem.setValue(LastSnapshotHashItem.fallback);
      await LastSnapshotDateItem.setValue(0);
    },
    danger: true
  } satisfies TButtonOption,
  DANGER_CLEAR_ALL_SYNC: {
    type: "button",
    name: "danger_clear_all_sync",
    label: "options.danger.clearAllSync.label",
    button: "options.danger.clearAllSync.button",
    description: [
      "options.danger.clearAllSync.description.A",
      "options.danger.clearAllSync.description.B"
    ],
    reset: false,
    onPress: async () => {
      const syncStorage = await browser.storage.sync.get();
      Object.keys(syncStorage).forEach(k => {
        if (k.startsWith("sync_op-")) {
          console.log("Removing: ", k);
          browser.storage.sync.remove(k);
        }
      });
      await CompleteOpsItem.setValue(new Map<UUID, number>());
    },
    danger: true
  } satisfies TButtonOption,
  TAB_SYNC_ENABLED: {
    type: "check",
    name: "tab_sync_enabled",
    label: "options.tab_sync_enabled.label",
    item: storage.defineItem<boolean>("local:tab_sync_enabled", {
      init: () => false,
      fallback: false,
    }),
    reset: true,
    description: [
      "options.tab_sync_enabled.description.A",
      "options.tab_sync_enabled.description.B",
      "options.tab_sync_enabled.description.C",
    ]
  } satisfies TCheckOption,
  TAB_SYNC_UUID: {
    type: "key",
    name: "tab_sync_uuid",
    label: "options.tab_sync_uuid.label",
    item: storage.defineItem<UUID>("local:tab_sync_uuid", {
      init: () => crypto.randomUUID(),
      fallback: "----"
    }),
    gen: () => crypto.randomUUID(),
    reset: false,
    description: [
      "options.tab_sync_uuid.description.A",
    ],
  } satisfies TKeyOption,
  TAB_SYNC_CLEAR: {
    type: "button",
    name: "tab_sync_clear",
    label: "options.tab_sync_clear.label",
    button: "options.tab_sync_clear.button",
    description: [
      "options.tab_sync_clear.description.A"
    ],
    reset: false,
    onPress: async () => {
      storage.removeItem(`sync:sync_op-${await Options.TAB_SYNC_UUID.item.getValue()}`);
      storage.removeItem(`local:sync_op-${await Options.TAB_SYNC_UUID.item.getValue()}`);
    },
    danger: false
  } satisfies TButtonOption,
  TAB_SYNC_INSTANCES: {
    type: "instance_list",
    name: "tab_sync_instances",
    label: "options.tab_sync_instances.label",
    item: storage.defineItem<TSyncInstance[]>("sync:sync_instances", {
      fallback: []
    }),
    description: [
      "options.tab_sync_instances.description.A",
      "options.tab_sync_instances.description.B",
      "options.tab_sync_instances.description.C"
    ],
    reset: false,
  } satisfies TInstanceOption,
  SHOW_CONTEXT_MENU: {
    type: "check",
    name: "show_context_menu",
    label: "options.showContextMenu.label",
    item: storage.defineItem<boolean>("local:show_context_menu", {
      init: () => true,
      fallback: true
    }),
    description: [
      "options.showContextMenu.description.A",
      "options.showContextMenu.description.B"
    ],
    reset: true,
    chrome: false
  } satisfies TCheckOption,
  PIN_DASHBOARD: {
    type: "check",
    name: "pin_dashboard",
    label: "options.PinDashboard.label",
    item: storage.defineItem<boolean>("local:pin_dashboard", {
      init: () => false,
      fallback: false
    }),
    description: [
      "options.pinDashboard.description.A"
    ],
    reset: true
  } satisfies TCheckOption
};

export const OptionsGroup: {
  key: string,
  name: string,
  options: (keyof typeof Options)[],
}[] = [
    {
      key: "general",
      name: "General Settings",
      options: [
        "PIN_DASHBOARD",
        "SHOW_CONTEXT_MENU"
      ]
    },
    {
      key: "tabs",
      name: "Tab Settings",
      options: [
        "REMOVE_TABS_RESTORED",
        "REMOVE_TABS_FUNNELLED",
        "IGNORE_DUPLICATE_TABS",
        "SWITCH_TAB_RESTORED",
        "FUNNEL_PINNED_TABS",
        "RESTORE_AS_PINNED",
        "SHOW_CONTEXT_MENU"
      ]
    },
    {
      key: "snapshots",
      name: "Snapshot Settings",
      options: [
        "SNAPSHOT_FREQUENCY",
        "SNAPSHOT_LOCATION",
      ]
    },
    {
      key: "sync",
      name: "Sync Settings",
      options: [
        "TAB_SYNC_ENABLED",
        "TAB_SYNC_INSTANCES",
        "TAB_SYNC_CLEAR",
        "TAB_SYNC_UUID",
      ]
    },
    {
      key: "appearance",
      name: "Appearance Settings",
      options: [
        "FONT_OVERRIDE",
        "CURRENT_THEME",
      ]
    },
    {
      key: "dangerous",
      name: "Dangerous Settings",
      options: [
        "DANGER_RESET_TO_DEFAULT",
        "DANGER_REMOVE_DUPLICATES",
        "DANGER_CLEAR_TABS",
        "DANGER_CLEAR_SNAPSHOT_DATE",
        "DANGER_CLEAR_ALL_SYNC",
      ]
    }
  ];
