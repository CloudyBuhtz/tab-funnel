import { WxtStorageItem } from "wxt/storage";

export type OptionV2 = TextOptionV2 | CheckOptionV2 | MultiOptionV2 | ButtonOptionV2 | KeyOptionV2;

type BasicOptionV2 = {
  name: string;
  label: string;
  description: string[];
  reset: boolean;
};

export type TextOptionV2 = BasicOptionV2 & {
  type: "text";
  placeholder?: string;
  pattern?: RegExp;
  item: WxtStorageItem<string, Record<string, string>>;
};

export type CheckOptionV2 = BasicOptionV2 & {
  type: "check";
  item: WxtStorageItem<boolean, Record<string, boolean>>;
};

export type MultiOptionV2<T = MultiType> = BasicOptionV2 & {
  type: "multi";
  options: readonly T[];
  item: WxtStorageItem<T, Record<string, T>>;
};

export type ButtonOptionV2 = BasicOptionV2 & {
  type: "button";
  onPress: Function;
};

export type KeyOptionV2 = BasicOptionV2 & {
  type: "key";
  item: WxtStorageItem<string, Record<string, string>>;
};

const snapshotFrequencyOptions = ["never", "only_funnel", "every_change", "hourly", "daily", "weekly", "monthly"];
const currentThemeOptions = ["one_dark", "one_light", "kanagawa_wave", "kanagawa_dragon", "kanagawa_lotus", "gruvbox_dark", "gruvbox_light", "catpuccin_latte", "catpuccin_frappe", "catpuccin_macchiato", "catpuccin_mocha", "tokyonight_day", "tokyonight_moon", "tokyonight_night", "tokyonight_storm", "dracula", "nord",];
type MultiType = typeof snapshotFrequencyOptions[number] | typeof currentThemeOptions[number];

export const Options = {
  SNAPSHOT_FREQUENCY: {
    type: "multi",
    name: "snapshot_frequency",
    label: "options.snapshot_frequency.label",
    item: storage.defineItem("sync:snapshot_frequency", {
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
  } as MultiOptionV2<typeof snapshotFrequencyOptions[number]>,
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
  } as CheckOptionV2,
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
  } as CheckOptionV2,
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
  } as CheckOptionV2,
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
  } satisfies CheckOptionV2,
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
  } satisfies CheckOptionV2,
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
  } satisfies TextOptionV2,
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
  } satisfies TextOptionV2,
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
  } satisfies MultiOptionV2<typeof currentThemeOptions[number]>,
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
  } satisfies CheckOptionV2,
  DANGER_RESET_TO_DEFAULT: {
    type: "button",
    name: "reset_options_to_default",
    label: "options.danger.resetOptions.button",
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
    }
  } satisfies ButtonOptionV2,
  DANGER_REMOVE_DUPLICATES: {
    type: "button",
    name: "remove_duplicates",
    label: "options.danger.removeAllDuplicates.button",
    description: [
      "options.danger.removeAllDuplicates.description.A",
      "options.danger.removeAllDuplicates.description.B"
    ],
    reset: false,
    onPress: () => { alert("removing buddy"); }
  } satisfies ButtonOptionV2,
  DANGER_CLEAR_TABS: {
    type: "button",
    name: "danger_clear_tabs",
    label: "options.danger.clearAllTabs.button",
    description: [
      "options.danger.clearAllTabs.description.A",
      "options.danger.clearAllTabs.description.B"
    ],
    reset: false,
    onPress: () => { alert("we ball"); }
  } satisfies ButtonOptionV2,
  DANGER_CLEAR_SNAPSHOT_DATE: {
    type: "button",
    name: "danger_clear_snapshots",
    label: "options.danger.clearSnapshotDate.button",
    description: [
      "options.danger.clearSnapshotDate.description.A"
    ],
    reset: false,
    onPress: () => { alert("we ball"); }
  } satisfies ButtonOptionV2,
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
      "options.tab_sync_enabled.description.B"
    ]
  } satisfies CheckOptionV2,
  TAB_SYNC_UUID: {
    type: "key",
    name: "tab_sync_uuid",
    label: "options.tab_sync_uuid.label",
    item: storage.defineItem("local:tab_sync_uuid", {
      init: () => crypto.randomUUID(),
      fallback: "- - -"
    }),
    reset: false,
    description: [
      "options.tab_sync_uuid.description.A",
    ],
  } satisfies KeyOptionV2,
};

export const OptionsGroup: {
  key: string,
  name: string,
  options: (keyof typeof Options)[],
}[] = [
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
      ]
    },
    {
      key: "snapshots",
      name: "Snapshot Settings",
      options: [
        "SNAPSHOT_FREQUENCY",
        "SNAPSHOT_LOCATION"
      ]
    },
    {
      key: "sync",
      name: "Sync Settings",
      options: [
        "TAB_SYNC_ENABLED",
        "TAB_SYNC_UUID"
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
        "DANGER_CLEAR_SNAPSHOT_DATE"
      ]
    }
  ];
