# Welcome to Tab Funnel

<div>## [What's new in v0.3.0](/dashboard.html) [unfinished]</div>

Thanks for installing Tab Funnel! I appreciate you checking this out; this document outlines functions and concepts of the addon. If you know what you're doing or are happy to figure it out without lots of reading feel free to close this tab or continue on to see all the features of this addon.

Tab Funnel was made mostly for myself, as a solution to cleaning up my Tabs. It's simple in functionality, but effort has been added to make it user friendly and safe in terms of making sure that data is backed up.

## What is Tab Funnel?
Tab Funnel is an addon that can be used to clear up your tabs from your browser, freeing space while also being able to organise, manage and sort them.

Instead of having tons of tabs filling up your bar, you can put them in a neat list.

` `  
` `
` `  

---

` `  
` `  

## Features

### Funnel Tabs
The main function of this Addon, clicking the funnel on your toolbar will open a small menu. Clicking `Funnel All Tabs` will move all the tabs in your current window into the Funnel.

You can even funnel tabs individually or in a more fine grained manner by right clicking on any tab in your tab bar. From here you can:
- Funnel This Tab
- Funnel Other Tabs
- Funnel Tabs to Left
- Funnel Tabs to Right

### Dashboard
The Dashboard is the home for all your funnelled tabs! Opening the menu from the Funnel icon and clicking `Show Dashboard` will bring it up.

Clicking any Tab title in this list will restore it back to your tab bar.

### Sorting / Grouping
By default, the dashboard shows all your tabs in a big long list, sorted by when they Funnelled. There are a few options for ways to group the tabs and then sort those tabs in each group.

#### Grouping
- **Ungrouped** is the default where all your tabs are show in one big list, this can be a bit daunting once you have tons of tabs so there are better options.

- **Group by Date** shows tabs grouped by individual times the `Funnel All Tabs` was clicked. This can essentially snapshot the tab-bar in that state, letting you look at what you were doing at that particular time.

- **Group by Site** shows tabs grouped by sites. This can be useful to find other tabs for a particular site you may have looked at in the past or just find a specific site easier.

#### Sorting
- **Sort by Date** displays the tabs ordered by the date and time they were Funnelled. If you also use **Group by Date** it essentially shows tabs in the order they were on the tab bar when originally Funnelled.

- **Sort by Name** displays tabs sorted by their title displayed in the Dashboard.

- **Sort by URL** displays tabs sorted by their URL, it's not always the most useful option but it is there if you want it.

Each of the group and sort options can be done ascending and descending by using the little icons next to the drop down for each sort / group.

### Searching Tabs
There are two ways you can search through your tabs:

First you can just simply use `Ctrl+f` with the Dashboard open using your browsers default search.

Second, you can use your browsers url bar and type `tf` followed by a space to start searching through all your Funnelled Tabs.

### Snapshots (Backups)
One of the features that sets **Tab Funnel** apart from others is its robust backups, called `Snapshot`s they are essentially a full backup of the current tabs. They can be done manually or setup to be done automatically over time or in response to changes to the data.

Snapshots are stored in your downloads folder, the default folder name for them is `tab-funnel` but it can be changed in the options for the addon.

#### Why is there no options for Syncing with X Service?
Tab Funnel is built to allow the user to sync their Snapshots however they wish using solutions they already posses. Which is why snapshots are saved as files that you can backup wherever you wish, it's your data and Tab Funnel leaves it in your hands. There is no calling home, no server keeping track of your tabs or slurping up all the data it can get to sell to companies.

### Importing
If you're coming from another addon that lists tabs, you can import then at the Dashboard; using the `Import List` option.

### Options
Opening up the menu and clicking the cog will show the Options, from here you can fine-tune how Tab Funnel works and looks.

### Theming
Currently Tab Funnel has a handful of themes that can alter how everything looks, more may be added in the future.

If you are a developer and would like to add more themes, feel free to throw up a PR.


` `  
` `
` `  

---

` `  
` `  

## What's Missing?

### Editing Tabs
Tab Funnel has no options for editing tabs themselves, changing the date they were Funnelled. This is by design, Tab Funnel isn't trying to be a do-all solution to tabs. As listed in the next sections, customisation of the underlying data isn't really within the scope of the addon. There are currently no plans to have tab editing.

#### Drag and Drop
Other addons allow you to move tabs between groups; this functionality is not in Tab Funnel; you cannot reorder tabs or move them around. The concept for the Dashboard is to group and sort tabs based on their data and not to edit the tabs and create groups that the user wants.

There is a possibility that moving tabs within the `Group by Date` option will copy the date from one tab group to the other essentially 'moving' it. Though I'm not 100% on whether this is a function worth the amount of time to cover all the edge cases.

#### Custom Groups
Tab Funnel does not allow the user to create custom groups, name them or move Tabs around within them. This is fundamentally not the aim for the Addon and there are better alternatives.

*- Alternatives coming soon -*

#### Sync Between Installs
Tabs are currently not synced between installs, if you want to keep your Dashboard synced between say a laptop and a computer you will need to sync the backups using a external program and then import the Snapshot between each of them.

This is a planned feature, it will most likely automatically import the most up to date Snapshot as long as it exists in the Snapshot folder; this will still necessitate an external backup program to keep the Snapshot folder in sync.

#### Mobile Version
Currently, Tab Funnel is made for the desktop; a mobile version is planned and will be coming at some point.


` `  
` `
` `  

---

` `  
` `    

## Update Roadmap?
Here are some things coming in future updates!

#### Group by Date Granularity
Currently grouping by date is by exact millisecond, this means that tabs are only grouped if Funnelled at exactly the same time. Sometimes you might want to see what you've Funnelled day by day or week by week; this feature will add exactly that.

#### More Themes
More themes are always coming, almost all will be based on NeoVim and other editor themes.

#### Sync Between Installs
Syncing between multiple installs of the Addon, for example between a laptop, computer or mobile. A hash of the latest snapshot will be saved separately, along with a new Auto Funnel option for making snapshots on close will allow you to keep tabs synced. Not in real time, but as one is opened.

An alternate plan for syncing changes as they are made using the browsers setting sync to save changes as they are made and those to be watched by the other install. This may take a while to get working and all the edge cases dealt with.

The final option is to setup a third party server to keep things synced, I don't want to handle user data as it comes with lots of extra effort, checks and balances. This would be the most difficult to implement as I would want to make sure everything was encrypted and sensitive Tab data would be preserved and kept private for the user.

#### Mobile Version
A Mobile version of the addon will be investigated and worked on.