import { Options } from "./options";
import type { Tab } from "./data";

export const TabItem = storage.defineItem<Tab[]>("local:tabs", {
  fallback: [],
});

export const TabCountItem = storage.defineItem<number>("local:tab_count", {
  fallback: 0,
});

export const LastSnapshotDate = storage.defineItem<number>("local:last_snapshot_date", {
  fallback: 0,
});

type SnapshotFrequencyType = "never" |
  "only_funnel" |
  "every_change" |
  "hourly" |
  "daily" |
  "weekly" |
  "monthly";
const SnapshotFrequencyOption = Options.SNAPSHOT_FREQUENCY;
export const SnapshotFrequencyItem = storage.defineItem<SnapshotFrequencyType>(`${SnapshotFrequencyOption.area}:${SnapshotFrequencyOption.name}`, {
  fallback: SnapshotFrequencyOption.defaultValue as SnapshotFrequencyType,
});

const RemoveTabsRestoredOption = Options.REMOVE_TABS_RESTORED;
export const RemoveTabsRestoredItem = storage.defineItem<boolean>(`${RemoveTabsRestoredOption.area}:${RemoveTabsRestoredOption.name}`, {
  fallback: RemoveTabsRestoredOption.defaultValue,
});

const RemoveTabsFunnelledOption = Options.REMOVE_TABS_FUNNELLED;
export const RemoveTabsFunnelledItem = storage.defineItem<boolean>(`${RemoveTabsFunnelledOption.area}:${RemoveTabsFunnelledOption.name}`, {
  fallback: RemoveTabsFunnelledOption.defaultValue,
});

const IgnoreDuplicateTabsOption = Options.IGNORE_DUPLICATE_TABS;
export const IgnoreDuplicateTabsItem = storage.defineItem<boolean>(`${IgnoreDuplicateTabsOption.area}:${IgnoreDuplicateTabsOption.name}`, {
  fallback: IgnoreDuplicateTabsOption.defaultValue,
});

const SwitchTabRestoredOption = Options.SWITCH_TAB_RESTORED;
export const SwitchTabRestoredItem = storage.defineItem<boolean>(`${SwitchTabRestoredOption.area}:${SwitchTabRestoredOption.name}`, {
  fallback: SwitchTabRestoredOption.defaultValue,
});

const FunnelPinnedTabsOption = Options.FUNNEL_PINNED_TABS;
export const FunnelPinnedTabsItem = storage.defineItem<boolean>(`${FunnelPinnedTabsOption.area}:${FunnelPinnedTabsOption.name}`, {
  fallback: FunnelPinnedTabsOption.defaultValue,
});

const SnapshotLocationOption = Options.SNAPSHOT_LOCATION;
export const SnapshotLocationItem = storage.defineItem<string>(`${SnapshotLocationOption.area}:${SnapshotLocationOption.name}`, {
  fallback: SnapshotLocationOption.defaultValue,
});
