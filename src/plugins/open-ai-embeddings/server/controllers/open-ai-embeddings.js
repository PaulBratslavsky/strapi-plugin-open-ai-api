"use strict";
const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;

module.exports = ({ strapi }) => ({
  async createEmbedding(ctx) {
    try {
      return await strapi
        .plugin("open-ai-embeddings")
        .service("embeddings")
        .createEmbedding(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async deleteEmbedding(ctx) {
    try {
      return await strapi
        .plugin("open-ai-embeddings")
        .service("embeddings")
        .deleteEmbedding(ctx.params);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getEmbeddings(ctx) {
    const contentType = strapi.contentType(
      "plugin::open-ai-embeddings.embedding"
    );
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
    const contentType = strapi.contentType(
      "plugin::open-ai-embeddings.embedding"
    );
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
        .plugin("open-ai-embeddings")
        .service("embeddings")
        .queryEmbeddings(ctx.query);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});
