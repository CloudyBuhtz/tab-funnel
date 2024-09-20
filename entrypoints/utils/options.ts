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

export const Options = {
  SNAPSHOT_FREQUENCY: {
    name: "snapshot_frequency",
    label: "Automatic Snapshot Frequency",
    area: "local",
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
      "Calculated as absolute time between snapshots, not necessarily when the date / time changes.",
      "'Only Funnel' activates only when tabs are Funnelled.",
      "'Every Change' activates when tabs are Funnelled and Removed.",
    ],
  } as MultiOption,
  REMOVE_TABS_RESTORED: {
    name: "remove_tabs_restored",
    label: "Remove Tab when Restored",
    area: "local",
    type: "check",
    defaultValue: false,
    description: [
      "When checked, tabs clicked in the TabFunnel are removed as the tab is opened.",
    ],
  } as CheckOption,
  REMOVE_TABS_FUNNELLED: {
    name: "remove_tab_funnelled",
    label: "Remove Tab when Funnelled",
    area: "local",
    type: "check",
    defaultValue: true,
    description: [
      "When checked, Funnelled Tabs are Removed from the browser tab bar.",
    ],
  } as CheckOption,
  IGNORE_DUPLICATE_TABS: {
    name: "ignore_duplicate_tabs",
    label: "Ignore Duplicate Funnelled Tabs",
    area: "local",
    type: "check",
    defaultValue: false,
    description: [
      "When checked, Tabs with a duplicate URL are quietly ignored when Funnelled.",
    ],
  } as CheckOption,
  SWITCH_TAB_RESTORED: {
    name: "switch_tab_restored",
    label: "Switch to Restored Tab",
    area: "local",
    type: "check",
    defaultValue: false,
    description: [
      "When checked, clicking a Tab in the TabFunnel are immediately made active.",
    ],
  } as CheckOption,
  FUNNEL_PINNED_TABS: {
    name: "funnel_pinned_tabs",
    label: "Funnel Pinned Tabs",
    area: "local",
    type: "check",
    defaultValue: false,
    description: [
      "When checked, pinned tabs are also Funnelled. (as long as it is http/https)",
    ],
  } as CheckOption,
  SNAPSHOT_LOCATION: {
    name: "snapshot_location",
    label: "Snapshot location",
    area: "local",
    type: "text",
    defaultValue: "tab-funnel",
    placeholder: "tab-funnel",
    description: [
      "Defines the folder location of Snapshots, stored within the downloads folder.",
      "Restricted to a-z, A-Z, 0-9 and '-'.",
    ],
    pattern: /[^a-zA-Z0-9\-]/g,
  } as TextOption,
  FONT_OVERRIDE: {
    name: "font_override",
    label: "Font Override",
    area: "local",
    type: "text",
    defaultValue: "",
    placeholder: "",
    description: [
      "Defines a custom Font name you want to use for the entire UI",
      "No guarantees on non-breaking changes to UI",
      "Default Font (first occurrence of list): Bahnschrift, DIN Alternate, Franklin Gothic Medium, Nimbus Sans Narrow, sans-serif-condensed, sans-serif"
    ]
  } as TextOption,
};
