// @ts-nocheck
const pluginManager = require("../initialize");
const { Document } = require("langchain/document");
const { VectorDBQAChain } = require("langchain/chains");
const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;


module.exports = ({ strapi }) => ({
  async createEmbedding(data) {
    const plugin = await pluginManager.getSettings();

    const entity = await strapi.entityService.create(
      "plugin::open-ai-embeddings.embedding",
      data
    );

    const docs = [
      new Document({
        metadata: {
          id: entity.id,
          title: entity.title,
          collectionType: data.data.collectionType,
          fieldName: data.data.fieldName,
        },
        pageContent: data.data.content,
      }),
    ];

    const toJason = JSON.stringify(docs);
    const ids = await plugin.pineconeStore.addDocuments(docs);

    data.data.embeddingsId = ids[0];
    data.data.embeddings = toJason;

    const response = await strapi.entityService.update(
      "plugin::open-ai-embeddings.embedding",
      entity.id,
      data
    );

    return response;
  },
  async deleteEmbedding(params) {
    const plugin = await pluginManager.getSettings();

    const currentEntry = await strapi.entityService.findOne(
      "plugin::open-ai-embeddings.embedding",
      params.id
    );

    const ids = [currentEntry.embeddingsId];
    await plugin.pineconeStore.delete({ ids: ids });
    const delEntryResponse = await strapi.entityService.delete(
      "plugin::open-ai-embeddings.embedding",
      params.id
    );

    return delEntryResponse;
  },
  async queryEmbeddings(data) {
    const emptyQuery = data?.query ? false : true;
    if (emptyQuery) return { error: "Please provide a query" };

    const plugin = await pluginManager.getSettings();

    const chain = VectorDBQAChain.fromLLM(
      plugin.model,
      pluginManager.pineconeStore,
      {
        k: 1,
        returnSourceDocuments: true,
      }
    );

    const response = await chain.call({ query: data.query });
    return response;
  },
});
