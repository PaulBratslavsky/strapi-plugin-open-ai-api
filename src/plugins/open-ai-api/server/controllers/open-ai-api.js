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

});
