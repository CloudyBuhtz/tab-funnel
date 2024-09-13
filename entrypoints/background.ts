import type { StorageItemKey } from "wxt/storage";
import { Options } from "./utils/options";
import { LastSnapshotDate, SnapshotFrequencyItem } from "./utils/storage";

const setupDefaultOptions = async (force: boolean = false) => {
  console.log("Filling Default Options");
  await Promise.all(Object.entries(Options).map(async ([_, option]) => {
    const storageKey = `${option.area}:${option.name}` as StorageItemKey;
    const currentValue: any | null = await storage.getItem(storageKey);
    if (currentValue !== null && !force) {
      console.log(`Existing ${option.name}`);
      return new Promise((x) => { x(null) });
    };
    console.log(`Filling ${option.name}`);
    return storage.setItem(storageKey, option.defaultValue);
  }));
  console.log("Done.");
};

//TODO: Finish this
const checkSnapshot = async () => {
  console.log("Checking Snapshot", new Date());

  const currentTime = Date.now();
  const lastSnapshotDate: number = await LastSnapshotDate.getValue();
  const snapshotDifference: number = currentTime - lastSnapshotDate;

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();

  switch (snapshotFrequency) {
    case "never":
    case "only_funnel":
    case "every_change":
      console.log("Do Nothing");
      return
    case "hourly":
      console.log("Hourly");
      if (snapshotDifference >= 3600000) {
        console.log("Snapping")
      }
      break;
    case "daily":
      console.log("Daily");
      if (snapshotDifference >= 86400000) {
        console.log("Snapping")
      }
      break;
    case "weekly":
      console.log("Weekly");
      if (snapshotDifference >= 604800000) {
        console.log("Snapping")
      }
      break;
    case "monthly":
      console.log("Monthly");
      if (snapshotDifference >= 2629746000) {
        console.log("Snapping")
      }
      break;
  };

  await LastSnapshotDate.setValue(currentTime);
};

export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });

  setupDefaultOptions(false);

  // setInterval(checkSnapshot, 60000);

});
