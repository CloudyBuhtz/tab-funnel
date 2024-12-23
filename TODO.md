## TODO

### 0.1.0
- [x] Add import / export menu (`@/dashboard/Dashboard.tsx`)
- [x] Show Bytes Used (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)

### 0.1.1
- [x] Remove Duplicate Tabs (`@/options/Options.tsx`)
- [x] Actually Backup before Clearing (`@/options/Options.tsx`)

### 0.1.2
- [x] Sort Site Name (`@/dashboard/Dashboard.tsx`)
- [x] Use ${tabCount} Tabs | ${tabSize} bytes Dashboard (`@/dashboard/Dashboard.tsx`)
- [x] Use sensible memory units for tabSize (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)

### 0.1.4
- [x] Key for description map (`@/options/Options.tsx`)
- [x] Open All option in ungrouped (`@/dashboard/Dashboard.tsx`)
- [x] Remove All option in ungrouped (`@/dashboard/Dashboard.tsx`)
- [x] Investigate removing ts-md5 (`meta`)

### 0.1.5
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

### 0.1.6 CSS Clean-up
- [x] Move Group View / Modal Views to components (`@/dashboard/Dashboard.tsx`)
- [x] Last snapshot as time since (seconds / minutes / hours / days / date) (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- [x] Reverse Group / Sort independently (`@/dashboard/Dashboard.tsx`)
- [x] Add options cog to top right corner of popup (`@/popup/Popup.tsx`)
- [x] Clean up CSS (`*.css`)
- [x] Danger Mode actions modals w/ warnings etc (`@/options/Options.tsx`)
- [x] Migrate `Tab` to use UUID (`@/utils/data.ts`)

### 0.1.7 Hotfix
- [x] Browser Runtime onInstalled trigger error (`@/background.ts`)

### 0.2.0 Theme Update
- [x] Remove UUID Migrate (`@/background.ts`)
- [x] Change theming of inputs (`@/assets/global.css`)
- [x] Change checkboxes (`@/assets/global.css`)
- [x] Fix: Text Input (`@/components/TextInput.tsx`)
- [x] Context dependant sort icons (`@/dashboard/Dashboard.tsx`)
- [x] Chrome specific css inject fix (`@/assets/global.css`)
- [x] Custom select element wraps select (`@/dashboard/Dashboard.tsx`, `@/assets/global.css`)
- [x] Options `danger-zone` css theming (`@/options/Options.tsx`, `@/options/Options.css`)
- [x] Font Override (`@/components/FontSwitcher.tsx`)
- [x] Change components to default exports where possible (`@/components/*.tsx`)
- [x] Improve Icon
- [x] Rename `xyxInput` to `xyzOption` (`@/components/*Input.tsx`)
- [x] Fix Button Styling (`@/assets/global.css`)
- [x] Multiple Themes (`@/themes/*.ts`)
- [x] Clean-up CSS theme (`@/assets/global.css`)

### 0.2.1 Clean-Up
- [x] Option Grouping (`@/utils/options.ts`, `@/assets/global.css`)
- [x] Clean-up basic theme
- [x] Remove console logs

### 0.2.2 Themes!
- [x] Make icon slightly smaller? (`@/public/icon/*.png`)
- [x] Fix overwrite checkbox on Snapshot Import (`@/components/ImportSnapshotModal.tsx`)
- [x] Themes Added (`@/components/themes/*.ts`)
  - [x] One Dark (dark)
  - [x] One Light (light)
  - [x] Kanagawa Wave (dark)
  - [x] Kanagawa Dragon (dark)
  - [x] Kanagawa Lotus (light)

### 0.3.0 Functions Galore
- [x] Suggest tabs from Address Bar (`@/background.ts`)
- [x] Sync storage (`@util/)
- [x] Re-pin itself if it was already before update (`@/background.ts`)
- [x] Funnel tabs from menu (`@/background.ts`)
- [x] Onboarding page (`@/onboarding/index.html`)

### 0.4.0 Internationalization Update / Pinned Tabs
- [x] Add link to onboarding on Options (`@/options/Options.tsx`)
- [x] Add link to version on version text in popup / dashboard (`@/dashboard/Dashboard.tsx`, `@/popup/Popup.tsx`)
- [x] Source all Themes (`@/components/themes/*.ts`)
- [x] Add i18n support (`@/locales/en.yml`, `*.tsx`)
- [x] Display pin icon beside pinned tabs (`@/dashboard/Dashboard.tsx`)
- [x] Add pinned as boolean to Tab Type
- [x] Restore pinned tabs to pinned status
- [x] Option to restore as pin or not
- [x] Fix date sorting, when importing old tabs
- [x] Change favicon URL to DuckDuckGo (`@/components/BaseTabView.tsx`)
- [x] Add images to onboarding

### 0.4.1 Favicon Fix
- [x] Add onerror fallback image

### 1.0.0 Update 1.0
- [x] Public Release
- [x] Public Github

### 1.0.1 Post Launch Fixes
- [x] Link to GitHub on options page menu
- [x] Add reset options to default under dangerous options
- [x] Fix funnelling pinned tabs in context menus
- [x] Add `color-scheme` to every theme to use `light-dark()` sections when present
- [x] Gruvbox Theme Added

### 1.1.0 Group by Granularity
- [x] Add control on Dashboard to choose granularity
- [x] Group by Date now uses the granularity
- [x] Only show granularity when date is selected
- [x] Text Entry Fix (Chrome)
- [x] Omnibox Fix (Chrome)
- [x] Alarms instead of `onInterval` (Chrome / MV3)
- [x] Conditionally setup menus (Firefox)
- [x] Conditionally add NewTab page (Firefox)
- [x] Funnel Selected Tabs fix (All)
- [x] Fix Alignment / Spacing on Dashboard
- [x] Missing i18n string
- [x] Show URL on Tab Hover
- [x] Separate Download functionality between Firefox and Chrome

### 1.1.1 CSS Fix
- [x] Dashboard z-index of Tab Hover

### 1.1.2 Omnibox Fix
- [x] Divert behaviour between firefox and chrome

### 1.2.0 Group by Name / Themes
- [x] Store whether dashboard was pinned, re-pin on update
- [x] Every time Dashboard is loaded, check whether it is pinned
- [x] On update, check this when re-opening Dashboard
- [x] Group by Name
- [x] CSS Changes
- [x] Catpuccin
- [x] Tokyo Night
- [x] Dracula
- [x] Nord
- [x] Gruvbox Light

### 1.3.1 Firefox Sync Branch
- [x] Various CSS Fixes
- [x] Danger FG instead of background; essentially RED
- [x] lastSnapshotDate Fix
- [x] Dashboard Add / Rem
- [x] Re-write Onboarding
- [x] Update package.json to 1.3.1
- [x] Update version info
- [x] Update README.md with new Feature
- [x] Update addon page with new Feature
- [x] Update description to list requiring addon sync in Firefox Sync

#### Tab Sync (Firefox)
- [x] Enable Sync Setting
- [x] Sync Instance UUID Setting
- [x] Re-Add Dangerous Button Behaviour
- [x] Add functionality for regenerating instance UUID
- [x] Move Sync Functionality to sync.ts
- [x] Keep local ops in `local:sync_op-*`
- [x] Add optional `new` property to TabV2
- [x] BaseTabView add blip to `new` tabs
- [x] Remove `new` status on hover for tab
- [x] Last Sync Date Shown
- [x] Show Used / Available Space
- [x] InstanceList setting
- [x] Sort SyncOps to have ConOp[] to be at the front
- [x] Have explicit number of Instances
- [x] Make sync:sync-instances which is a list of instances by ID or NAME
- [x] Can edit this, remove instances or add more
- [x] Sort instance list
  - [x] Local first
  - [x] Then Alphabetical
  - [x] Different icon for local / remote
- [x] Make instance in list able to click to copy

#### Options Changes
- [x] Replace DangerZone with just using a `Dangerous Settings` group
- [x] KeyOption
- [x] ButtonOption (`dangerous options`)
- [x] Redo all options to use `wxtStorageItem` instead of defining keys
- [x] Options Rework
- [x] Instance List copy icon shifts layout

### 1.4.0 Post Sync Update
- [x] Change funnel all tabs to a button + down arrow
  - [x] Add firefox right click context options as extra ways to funnel
  - [x] Only show `selected` for Firefox
  - [x] Add context menu as setting
- [x] Stop being able to close all tabs while funnelling
- [x] Clear CompleteOpsItem map when clearing all sync
- [x] Add platform checks to option
- [x] Add option for re-pinning the dashboard, since the check seems to fail always

### 1.?.0 ???
- [ ] Make dashboard more modular
- [ ] Move info panels into their own components
- [ ] Move control panel into its own component

### 1.?.0 TabFunnel Sync
- [ ] Encrypt Tabs
- [ ] Store Tabs w/ Upload Thing
  - [ ] Replace Old
- [ ] Database
  - [ ] Match UUID -> File using Sqlite
  - [ ] Store UUID, date of upload and FileID
  - [ ] Clean-up File after not being updated in X amount of time
- [ ] Heavily rate limit
- [ ] Some sort of tracking for bad usage
- [ ] File size limit (2GB)/(1mb) 2000 users

### 1.4.0 Mobile Version
### 1.5.0 Import List 2.0
- [ ] Investigate fetching the tabs instead of opening them natively
- [ ] Possibly open them hidden if that doesn't work
  - [ ] Show progress bar

### X.0 Possible Additions
- [ ] Store as Bookmarks
  - [ ] Put into `tabfunnel` folder
  - [ ] Save everything as tabs instead
  - [ ] Backup as json still
  - [ ] big work
  - [ ] Synced using browser

- [ ] Integrate with Tree-Style Tabs ( https://github.com/piroor/treestyletab/wiki/API-for-other-addons )
- [ ] Opening Multiple Dashboards will de-sync
- [ ] Drag Tabs from Dashboard, add URL as drag data
- [ ] Multiple Windows Functions
  - [ ] Figure this out

- [ ] Tags
  - [ ] Tag certain things, sort by tags. Untagged will always be at the bottom
  - [ ] Clicking a tag will auto sort by tags and go to that tag

- [ ] History Feature?
  - [ ] Changes kept, so that undo can be done
  - [ ] See timeline of changes
  - [ ] Who wants this?

- [ ] New Display Options
  - [ ] Multiple Columns
  - [ ] Display as Icons
    - [ ] Looks kind of like vanilla new tab page
  - [ ] Specific New Tab Page
