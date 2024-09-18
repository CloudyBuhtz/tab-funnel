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
- [ ] Move Group View / Modal Views to components (`@/dashboard/Dashboard.tsx`)
- [ ] Last snapshot as time since (seconds / minutes / hours / days / date) (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- [ ] Clean up CSS (`*.css`)
  - [x] Use light-dark to make theme variables
  - [ ] Replace all other light-dark with those variables
  - [ ] Use kebab case for classes
- [ ] Migrate `Tab` to use UUID (`@/utils/data.ts`)
- [ ] Reverse Group / Sort independently (`@/dashboard/Dashboard.tsx`)
  - [ ] Custom checkbox graphic arrow maybe to show direction
- [ ] Add options cog to top right corner of popup (`@/popup/Popup.tsx`)
- [ ] Danger Mode actions modals w/ warnings etc (`@/options/Options.tsx`)
- [x] Add `.prettierrc`
  - [ ] Fix all the weird problems
  - [ ] Pretty every file
- ### 0.1.7 Theming Update
- [ ] Font Override
- [ ] Multiple Themes
- [ ] Improve Icon
- ### 0.1.8
- [ ] Suggest tabs from Address Bar
  - [ ] Using the Omnibox API

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
