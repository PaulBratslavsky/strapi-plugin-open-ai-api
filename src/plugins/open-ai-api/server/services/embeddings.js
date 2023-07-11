// @ts-nocheck
const pluginManager = require("./initialize");

module.exports = ({ strapi }) => ({
  async createEmbedding(data) {
    const res = await strapi
      .plugin('open-ai-api')
      .service('openAiApi')
      .getSettings();

    const embeddings = await pluginManager.configureEmbeddings(res.apiKey);
    const resData = await embeddings.embedQuery(data.data.content);
    const toJason = JSON.stringify(resData);
    data.data.embeddings = toJason;
    return await strapi.entityService.create("plugin::open-ai-api.embedding", data);
  },

  async deleteEmbedding(ctx) { },
  async getEmbedding(ctx) { },
  async getEmbeddings(ctx) { },
})
