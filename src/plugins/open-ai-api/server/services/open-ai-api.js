module.exports = ({strapi}) => ({
  async updateSettings(payload) {
    const settings = await strapi.entityService.findMany("plugin::open-ai-api.setting");
    if (!settings) {
      return await strapi.entityService.create("plugin::open-ai-api.setting", payload);
    } else {
      return await strapi.entityService.update("plugin::open-ai-api.setting", settings.id, payload);
    }
  },

  async getSettings() {
    return await strapi.entityService.findMany("plugin::open-ai-api.setting");
  },


  async createEmbedding(ctx) {},
  async updateEmbedding(ctx) {},
  async deleteEmbedding(ctx) {},
  async getEmbedding(ctx) {},
  async getEmbeddings(ctx) {},
})