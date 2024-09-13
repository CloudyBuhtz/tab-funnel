import type { StorageItemKey } from "wxt/storage";
import { Options } from "./utils/options";

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

const setupSnapshotDate = async () => {
  const lastSnapshotDate: number = await storage.getItem("local:last_snapshot_date") ?? 0;
  await storage.setItem("local:last_snapshot_date", lastSnapshotDate);
};

//TODO: Finish this
const checkSnapshot = async () => {
  console.log("Checking Snapshot", new Date());

  const currentTime = Date.now();
  const lastSnapshotDate: number = (await storage.getItem("local:last_snapshot_date"))!;
  const snapshotDifference: number = currentTime - lastSnapshotDate;

  const snapshotFrequencyOption = Options.SNAPSHOT_FREQUENCY;
  const snapshotFrequency = await storage.getItem(`${snapshotFrequencyOption.area}:${snapshotFrequencyOption.name}` as StorageItemKey) ?? "Never";

  switch (snapshotFrequency) {
    case "Never":
    case "Only Funnel":
    case "Every Change":
      console.log("Do Nothing");
      return
    case "Hourly":
      console.log("Hourly");
      if (snapshotDifference >= 3600000) {
        console.log("Snapping")
      }
      break;
    case "Daily":
      console.log("Daily");
      if (snapshotDifference >= 86400000) {
        console.log("Snapping")
      }
      break;
    case "Weekly":
      console.log("Weekly");
      if (snapshotDifference >= 604800000) {
        console.log("Snapping")
      }
      break;
    case "Monthly":
      console.log("Monthly");
      if (snapshotDifference >= 2629746000) {
        console.log("Snapping")
      }
      break;
  };

  await storage.setItem("local:last_snapshot_date", currentTime);
};

export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });

  setupDefaultOptions(false);

  // setInterval(checkSnapshot, 60000);

});
