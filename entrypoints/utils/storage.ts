import type { Tab, TabV2, UUID } from "./data";

export const TabItem = storage.defineItem<TabV2[]>("local:tabs", {
  fallback: [],
  version: 2,
  migrations: {
    2: (tabs: Tab[]): TabV2[] => {
      return tabs.map((tab) => {
        return {
          title: tab.title,
          url: tab.url,
          date: tab.date,
          hash: tab.hash,
          pinned: tab.pinned ?? false,
        } as TabV2;
      });
    }
  }
});

export const TabCountItem = storage.defineItem<number>("local:tab_count", {
  fallback: 0,
});

export const LastSnapshotDateItem = storage.defineItem<number>("local:last_snapshot_date", {
  fallback: 0,
});

export const LastSnapshotHashItem = storage.defineItem<string>("local:last_snapshot_hash", {
  fallback: "",
});

export type TGroup = "ungrouped" | "group_by_date" | "group_by_site" | "group_by_name";
export const GroupItem = storage.defineItem<TGroup>("local:dashboard_group", {
  fallback: "ungrouped",
});

export const GroupReverseItem = storage.defineItem<boolean>("local:dashboard_group_reverse", {
  fallback: false,
});

export type TSort = "sort_by_date" | "sort_by_name" | "sort_by_url";
export const SortItem = storage.defineItem<TSort>("local:dashboard_sort", {
  fallback: "sort_by_date",
});

export type TGranularity = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
export const GranularityItem = storage.defineItem<TGranularity>("local:dashboard_granularity", {
  fallback: "seconds",
});

export const SortReverseItem = storage.defineItem<boolean>("local:dashboard_sort_reverse", {
  fallback: false,
});

export const LastSyncDateItem = storage.defineItem<number>("local:sync_last_sync_date", {
  fallback: 0
});

export type TSyncInstance = {
  id: UUID;
  name: string;
};
export const SyncInstancesItem = storage.defineItem<TSyncInstance[]>("sync:sync_instances", {
  init: () => []
});

export const CompleteOpsItem = storage.defineItem<Map<UUID, number>>("local:sync_complete_ops", {
  init: () => { return new Map<UUID, number>(); }
});
