import { browser } from "wxt/browser";
import { snapshotTabs, Tab } from "./utils/data";
import { hashString } from "./utils/misc";
import {
  LastSnapshotDateItem,
  LastSnapshotHashItem,
  SnapshotFrequencyItem,
  TabItem,
} from "./utils/storage";

const checkSnapshot = async () => {
  const currentTime = Date.now();
  const lastSnapshotHash: string = await LastSnapshotHashItem.getValue();
  const currentTabs = await TabItem.getValue();

  const lastSnapshotDate: number = await LastSnapshotDateItem.getValue();
  const snapshotDifference: number = currentTime - lastSnapshotDate;

  const currentTabsHash: string = await hashString(JSON.stringify(currentTabs));
  if (currentTabsHash === lastSnapshotHash) return;

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();

  switch (snapshotFrequency) {
    case "never":
    case "only_funnel":
    case "every_change":
      return;
    case "hourly":
      if (snapshotDifference >= 3600000) {
        snapshotTabs();
      }
      break;
    case "daily":
      if (snapshotDifference >= 86400000) {
        snapshotTabs();
      }
      break;
    case "weekly":
      if (snapshotDifference >= 604800000) {
        snapshotTabs();
      }
      break;
    case "monthly":
      if (snapshotDifference >= 2629746000) {
        snapshotTabs();
      }
      break;
  }
};

export default defineBackground(() => {
  setInterval(checkSnapshot, 60000);
});
