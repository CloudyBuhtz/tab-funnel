import { ConfigEnv, defineConfig, UserConfig, UserManifest, UserManifestFn } from 'wxt';

// https://vitejs.dev/config/


// See https://wxt.dev/api/config.html

const baseManifest: UserManifest = {
  permissions: ["storage", "unlimitedStorage", "tabs", "downloads", "menus", "alarms"],
  name: "Tab Funnel",
  omnibox: {
    keyword: "tf",
  },
  browser_specific_settings: {
    gecko: {
      id: "{322171a2-2a66-4ecf-9dcc-bd84b282d352}"
    }
  },
  default_locale: "en",
};

const firefoxManifest: UserManifest = {
  ...baseManifest, ...{
    chrome_url_overrides: {
      newtab: "dashboard.html"
    },
  }
};

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  manifest: ({ browser }: ConfigEnv) => {
    switch (browser) {
      case "chrome":
        return baseManifest;
      case "firefox":
        return firefoxManifest;
    }
  },
  vite: () => ({
    plugins: [
      // Custom plugin to load markdown files
      {
        name: "markdown-loader",
        transform(code, id) {
          if (id.slice(-3) === ".md") {
            // For .md files, get the raw content
            return `export default ${JSON.stringify(code)};`;
          }
        }
      }
    ]
  })
});
