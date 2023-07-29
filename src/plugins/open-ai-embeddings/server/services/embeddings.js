// @ts-nocheck
const pluginManager = require("./initialize");
const { Document } = require("langchain/document");
const { VectorDBQAChain } = require("langchain/chains");
const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;

async function getSettings() {
  return await strapi
    .plugin("open-ai-embeddings")
    .service("openAiEmbeddings")
    .getSettings();
}

function checkSettings(settings) {
  throw new ApplicationError(
    "Please provide a valid Open AI Embeddings settings"
  );
}

module.exports = ({ strapi }) => ({
  async createEmbedding(data) {
    const settings = await getSettings();

    // TODO: IMPLEMENT ERROR

    const plugin = await pluginManager.initialize(settings);

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

    console.log(response);
    return response;
  },
  async deleteEmbedding(params) {
    const settings = await getSettings();
    const plugin = await pluginManager.initialize(settings);

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

    const settings = await getSettings();

    const plugin = await pluginManager.initialize(settings);

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
