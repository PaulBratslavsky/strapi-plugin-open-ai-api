"use strict";
const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;

module.exports = ({ strapi }) => ({
  async updateSettings(ctx) {
    try {
      return await strapi
        .plugin("open-ai-api")
        .service("openAiApi")
        .updateSettings(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getSettings(ctx) {
    try {
      return await strapi
        .plugin("open-ai-api")
        .service("openAiApi")
        .getSettings();
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async createEmbedding(ctx) {
    try {
      return await strapi
        .plugin("open-ai-api")
        .service("embeddings")
        .createEmbedding(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async deleteEmbedding(ctx) {
    try {
      return await strapi
        .plugin("open-ai-api")
        .service("embeddings")
        .deleteEmbedding(ctx.params);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getEmbeddings(ctx) {
    const contentType = strapi.contentType("plugin::open-ai-api.embedding");
    const sanitizedQueryParams = await contentAPI.query(
      ctx.query,
      contentType,
      ctx.state.auth
    );

    try {
      return await strapi.entityService.findMany(
        contentType.uid,
        sanitizedQueryParams
      );
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getEmbedding(ctx) {
    const contentType = strapi.contentType("plugin::open-ai-api.embedding");
    const sanitizedQueryParams = await contentAPI.query(
      ctx.query,
      contentType,
      ctx.state.auth
    );

    try {
      return await strapi.entityService.findOne(
        contentType.uid,
        ctx.params.id,
        sanitizedQueryParams
      );
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async queryEmbeddings(ctx) {
    try {
      return await strapi
        .plugin("open-ai-api")
        .service("embeddings")
        .queryEmbeddings(ctx.query);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async updateEmbedding(ctx) {},
});
