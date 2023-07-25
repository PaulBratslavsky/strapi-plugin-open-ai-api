'use strict';

module.exports = ({ strapi }) => ({
  async updateSettings(ctx) {
    try {
      return await strapi
        .plugin('open-ai-api')
        .service('openAiApi')
        .updateSettings(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getSettings(ctx) {
    try {
      return await strapi
        .plugin('open-ai-api')
        .service('openAiApi')
        .getSettings();
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async createEmbedding(ctx) {
    try {
      return await strapi
        .plugin('open-ai-api')
        .service('embeddings')
        .createEmbedding(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async deleteEmbedding(ctx) {
    try {
      return await strapi
        .plugin('open-ai-api')
        .service('embeddings')
        .deleteEmbedding(ctx.params);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async queryEmbeddings(ctx) {
    try {
      return await strapi
        .plugin('open-ai-api')
        .service('embeddings')
        .queryEmbeddings(ctx.query);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async updateEmbedding(ctx) {},
  async getEmbedding(ctx) {},
  async getEmbeddings(ctx) {},

});
