export type Option = TextOption | CheckOption | MultiOption;

export type BasicOption = {
  name: string;
  label: string;
  area: "sync" | "local" | "session";
  description?: string[];
};

export type TextOption = BasicOption & {
  type: "text";
  defaultValue: string;
  placeholder?: string;
  pattern?: RegExp;
};

export type CheckOption = BasicOption & {
  type: "check";
  defaultValue: boolean;
};

export type MultiOption = BasicOption & {
  type: "multi";
  options: string[];
  defaultValue: string;
};

export const OptionsGroup = [
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
    key: "appearance",
    name: "Appearance Settings",
    options: [
      "FONT_OVERRIDE",
      "CURRENT_THEME",
    ]
  }
] as const;

export const Options = {
  SNAPSHOT_FREQUENCY: {
    name: "snapshot_frequency",
    label: "options.snapshot_frequency.label",
    area: "sync",
    type: "multi",
    options: [
      "never",
      "only_funnel",
      "every_change",
      "hourly",
      "daily",
      "weekly",
      "monthly",
    ],
    defaultValue: "never",
    description: [
      "options.snapshot_frequency.description.A",
      "options.snapshot_frequency.description.B",
      "options.snapshot_frequency.description.C",
    ],
  } as MultiOption,
  REMOVE_TABS_RESTORED: {
    name: "remove_tabs_restored",
    label: "options.remove_tabs_restored.label",
    area: "sync",
    type: "check",
    defaultValue: false,
    description: [
      "options.remove_tabs_restored.description.A",
    ],
  } as CheckOption,
  REMOVE_TABS_FUNNELLED: {
    name: "remove_tab_funnelled",
    label: "options.remove_tabs_funnelled.label",
    area: "sync",
    type: "check",
    defaultValue: true,
    description: [
      "options.remove_tabs_funnelled.description.A",
    ],
  } as CheckOption,
  IGNORE_DUPLICATE_TABS: {
    name: "ignore_duplicate_tabs",
    label: "options.ignore_duplicate_tabs.label",
    area: "sync",
    type: "check",
    defaultValue: false,
    description: [
      "options.ignore_duplicate_tabs.description.A",
    ],
  } as CheckOption,
  SWITCH_TAB_RESTORED: {
    name: "switch_tab_restored",
    label: "options.switch_tab_restored.label",
    area: "sync",
    type: "check",
    defaultValue: false,
    description: [
      "options.switch_tab_restored.description.A",
    ],
  } as CheckOption,
  FUNNEL_PINNED_TABS: {
    name: "funnel_pinned_tabs",
    label: "options.funnel_pinned_tabs.label",
    area: "sync",
    type: "check",
    defaultValue: false,
    description: [
      "options.funnel_pinned_tabs.description.A",
    ],
  } as CheckOption,
  SNAPSHOT_LOCATION: {
    name: "snapshot_location",
    label: "options.snapshot_location.label",
    area: "sync",
    type: "text",
    defaultValue: "tab-funnel",
    placeholder: "tab-funnel",
    description: [
      "options.snapshot_location.description.A",
      "options.snapshot_location.description.B",
    ],
    pattern: /[^a-zA-Z0-9\-]/g,
  } as TextOption,
  FONT_OVERRIDE: {
    name: "font_override",
    label: "options.font_override.label",
    area: "sync",
    type: "text",
    defaultValue: "",
    placeholder: "",
    description: [
      "options.font_override.description.A",
      "options.font_override.description.B",
      "options.font_override.description.C"
    ]
  } as TextOption,
  CURRENT_THEME: {
    name: "current_theme",
    label: "options.current_theme.label",
    area: "sync",
    type: "multi",
    options: [
      "one_dark",
      "one_light",
      "kanagawa_wave",
      "kanagawa_dragon",
      "kanagawa_lotus",
    ],
    defaultValue: "kanagawa_wave",
    description: [
      "options.current_theme.description.A"
    ]
  } as MultiOption,
  RESTORE_AS_PINNED: {
    name: "restore_as_pinned",
    label: "options.restore_as_pinned.label",
    area: "sync",
    type: "check",
    defaultValue: true,
    description: [
      "options.restore_as_pinned.description.A"
    ]
  } as CheckOption
};
