// @ts-nocheck
import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import pluginPermissions from "./permissions";
import getTrad from "./utils/getTrad";
import EmbeddingsWidget from './components/EmbeddingsWidget';


const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Open AI API",
      },
      Component: async () =>
        await import(/* webpackChunkName: "[request]" */ "./pages/App"),
      permissions: [],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
    // Adding a single link
    // app.addSettingsLink(
    //   'global', // id of the section to add the link to
    //   {
    //     intlLabel: {
    //       id: getTrad('Settings.open-ai-embeddings.link.title'),
    //       defaultMessage: 'Open AI API',
    //     },

    //     id: getTrad('Settings.open-ai-embeddings.link.title'),
    //     to: `/settings/${pluginId}`,
    //     Component: myComponent,
    //     permissions: pluginPermissions
    //   }
    // );
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad("Settings.open-ai-embeddings.link.title"),
          defaultMessage: "Open AI API",
        },
      },
      [
        {
          intlLabel: {
            id: getTrad("Settings.open-ai-embeddings.link.title"),
            defaultMessage: "Configurations",
          },

          id: getTrad("Settings.open-ai-embeddings.link.title"),
          to: `/settings/${pluginId}`,
          Component: async () =>
            await import(
              /* webpackChunkName: "open-ai-embeddings" */ "./pages/Settings"
            ),
          permissions: pluginPermissions,
        },
      ]
    );
  },

  bootstrap(app) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "open-ai-embeddings",
      Component: async () => <EmbeddingsWidget />,
    });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
