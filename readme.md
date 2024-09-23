# TabFunnel

## TODO

- ### 0.1.0
- [x] Add import / export menu (`@/dashboard/Dashboard.tsx`)
- [x] Show Bytes Used (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)

- ### 0.1.1
- [x] Remove Duplicate Tabs (`@/options/Options.tsx`)
- [x] Actually Backup before Clearing (`@/options/Options.tsx`)

- ### 0.1.2
- [x] Sort Site Name (`@/dashboard/Dashboard.tsx`)
- [x] Use ${tabCount} Tabs | ${tabSize} bytes Dashboard (`@/dashboard/Dashboard.tsx`)
- [x] Use sensible memory units for tabSize (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)

- ### 0.1.4
- [x] Key for description map (`@/options/Options.tsx`)
- [x] Open All option in ungrouped (`@/dashboard/Dashboard.tsx`)
- [x] Remove All option in ungrouped (`@/dashboard/Dashboard.tsx`)
- [x] Investigate removing ts-md5 (`meta`)

- ### 0.1.5
- [x] Investigate using UUID instead of hash (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- [x] Check if tabs have changed since last backup (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- [x] Remove console.log's (`all`)
- [x] Investigate Chrome light mode problems (`@/public/global.css`)
- [x] Support OneTab list natively as import (`@/dashboard/Dashboard.tsx`)
- [x] Reduce CPU / RAM usage during list import (`@/dashboard/Dashboard.tsx`)
- [x] Pull Group / Sort / Reverse into `storage.ts` (`@/dashboard/Dashboard.tsx`, `@/utils/storage.ts`)
- [x] Export doesn't always work first time (`@/dashboard/Dashboard.tsx`)
- [x] List size of each group (`@/dashboard/Dashboard.tsx`)
- [x] Confirm deletion of groups / all (`@/dashboard/Dashboard.tsx`)

- ### 0.1.6 CSS Clean-up
- [x] Move Group View / Modal Views to components (`@/dashboard/Dashboard.tsx`)
- [x] Last snapshot as time since (seconds / minutes / hours / days / date) (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- [x] Reverse Group / Sort independently (`@/dashboard/Dashboard.tsx`)
- [x] Add options cog to top right corner of popup (`@/popup/Popup.tsx`)
- [x] Clean up CSS (`*.css`)
- [x] Danger Mode actions modals w/ warnings etc (`@/options/Options.tsx`)
- [x] Migrate `Tab` to use UUID (`@/utils/data.ts`)

- ### 0.1.7 Hotfix
- [x] Browser Runtime onInstalled trigger error (`@/background.ts`)

- ### 0.2.0 Theme Update
- [x] Remove UUID Migrate (`@/background.ts`)
- [x] Change theming of inputs (`@/assets/global.css`)
- [x] Change checkboxes (`@/assets/global.css`)
- [x] Fix: Text Input (`@/components/TextInput.tsx`)
- [x] Context dependant sort icons (`@/dashboard/Dashboard.tsx`)
- [x] Chrome specific css inject fix (`@/assets/global.css`)
- [x] Custom select element wraps select (`@/dashboard/Dashboard.tsx`, `@/assets/global.css`)
- [x] Options `danger-zone` css theming (`@/options/Options.tsx`, `@/options/Options.css`)
- [x] Font Override
- [x] Change components to default exports where possible
- [x] Improve Icon
- [x] Rename `xyxInput` to `xyzOption`
- [x] Fix Button Styling
- [x] Multiple Themes
- [x] Clean-up CSS theme

- ### 0.2.1 Clean-Up
- [x] Option Grouping
- [x] Clean-up basic theme
- [x] Remove console logs

- ### 0.2.2 Options!
- [ ] Make icon slightly smaller?
- [ ] Add more themes
  - [ ] Gruv
  - [ ] Catpuccin
  - [ ] Nord
  - [ ] Tokyo Night
- [ ] Possibly move to non-auto light-dark switching
  - [ ] Kanagawa Wave
  - [ ] Kanagawa Lotus
  - [ ] Kanagawa Dragon
  - [ ] Basic Dark
  - [ ] Basic Light

- ### 0.3.0 Functions Galore
- [ ] Funnel tabs from menu (`@/background.ts`)
  - [ ] Funnel single tab
  - [ ] Funnel tabs to the right
  - [ ] Funnel tabs to the left
- [ ] Suggest tabs from Address Bar (`@/background.ts`)
  - [ ] Using the Omnibox API
- [ ] Onboarding page (`@/onboarding/index.html`)
- [ ] Re-pin itself if it was already before update (`@/background.ts`)
- [ ] Investigate using browser.theme API to set accent color?

- ### 1.0.0 Update 1.0
- [ ] Public Release
- [ ] Public Github
  - [ ] Figure out license

## Onboarding
```typescript
chrome.runtime.onInstalled.addListener(function (object) {
  let externalUrl = "http://yoursite.com/";
  let internalUrl = chrome.runtime.getURL("views/onboarding.html");

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl }, function (tab) {
      console.log("New tab launched with http://yoursite.com/");
    });
  }
});
```

## Verbiage

- Funnel(led): To put a tab into TabFunnel
- Tab: Browser tab
- Snapshot: The state of tabs at a certain time

## Goals

- Add tabs with click of button
  - Title
  - URL
  - Favicon
  - Date Added
- Store tabs in big list sectioned by date / name / site
- Store using addon storage
- Save snapshots
  - Every Change
  - Daily
  - Weekly
  - Manual
- Import snapshots

## Stretch

- Auto Funnel
- Import OneTab
- Firefox / Chrome addon storage
