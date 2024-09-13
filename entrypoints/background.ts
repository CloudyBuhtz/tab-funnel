import { LastSnapshotDateItem, SnapshotFrequencyItem } from "./utils/storage";
import { snapshotTabs } from "./utils/data";

const checkSnapshot = async () => {
  console.log("Checking Snapshot", new Date());

  const currentTime = Date.now();
  const lastSnapshotDate: number = await LastSnapshotDateItem.getValue();
  const snapshotDifference: number = currentTime - lastSnapshotDate;

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();

  console.log(lastSnapshotDate, currentTime, snapshotDifference);

  switch (snapshotFrequency) {
    case "never":
    case "only_funnel":
    case "every_change":
      return
    case "hourly":
      console.log("Hourly");
      if (snapshotDifference >= 3600000) {
        snapshotTabs();
      }
      break;
    case "daily":
      console.log("Daily");
      if (snapshotDifference >= 86400000) {
        snapshotTabs();
      }
      break;
    case "weekly":
      console.log("Weekly");
      if (snapshotDifference >= 604800000) {
        snapshotTabs();
      }
      break;
    case "monthly":
      console.log("Monthly");
      if (snapshotDifference >= 2629746000) {
        snapshotTabs();
      }
      break;
  };
};

export default defineBackground(() => {
  setInterval(checkSnapshot, 60000);
});
