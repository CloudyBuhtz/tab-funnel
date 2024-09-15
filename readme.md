# FOR REVIEWER

## Notes

My own builds are made using Bun, the `bun.lockb` is included in the repo
Uses `wxt`, `React` and `ts-md5`

## Instructions to build

Can probably use npm / pnpm / etc if you want.

Bun:

```
bun install
bun run zip:firefox
```

output will be in `.output/tab-funnel-VERSION-firefox.zip`

# TabFunnel

### Below this point is just notes used during development

## LITTLE BITS

- [ ] Show Next Snapshot Time
- [ ] Add import / export menu
- [x] Show Bytes Used

## TODO

- Popup
  - Info
    - Tabs Funnelled
    - Last Snapshot
    - Next Snapshot
  - Buttons
- Menu Options
- Importing / Exporting
  - Import from OneTab
  - Import from TabFunnel
  - Export as List

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
