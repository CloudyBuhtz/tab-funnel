# TabFunnel

## TODO

- [x] Add import / export menu
- [x] Show Bytes Used
- [x] Remove Duplicate Tabs (`@/options/Options.tsx`)
- [x] Actually Backup before Clearing (`@/options/Options.tsx`)
- [x] Sort Site Name (`@/dashboard/Dashboard.tsx`)
- [x] Use ${tabCount} Tabs | ${tabSize} bytes Dashboard (`@/dashboard/Dashboard.tsx`)
- [x] Use sensible memory units for tabSize (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- ### 0.1.4
- [x] Key for description map
- [x] Open All option in ungrouped (`@/dashboard/Dashboard.tsx`)
- [x] Remove All option in ungrouped (`@/dashboard/Dashboard.tsx`)
- [x] Investigate removing ts-md5

### 0.1.5

- [ ] Investigate using UUID instead of hash

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
