import { defineConfig } from 'wxt';

// https://vitejs.dev/config/


// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage", "unlimitedStorage", "tabs", "downloads", "menus"],
    name: "Tab Funnel",
    omnibox: {
      keyword: "tf",
    },
    browser_specific_settings: {
      gecko: {
        id: "{322171a2-2a66-4ecf-9dcc-bd84b282d352}"
      }
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
