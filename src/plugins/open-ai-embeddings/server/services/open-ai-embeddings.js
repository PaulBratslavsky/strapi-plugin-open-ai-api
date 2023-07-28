
module.exports = ({strapi}) => ({
  async updateSettings(payload) {
    const settings = await strapi.entityService.findMany("plugin::open-ai-embeddings.setting");
    if (!settings) {
      return await strapi.entityService.create("plugin::open-ai-embeddings.setting", payload);
    } else {
      return await strapi.entityService.update("plugin::open-ai-embeddings.setting", settings.id, payload);
    }
  },

  async getSettings() {
    return await strapi.entityService.findMany("plugin::open-ai-embeddings.setting");
  },
})