// @ts-nocheck
const pluginManager = require("./initialize");
const { Document } = require("langchain/document");
const { VectorDBQAChain } = require("langchain/chains");
const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;


const { v4: uuidv4 } = require("uuid");

async function getSettings() {
  return await strapi.plugin("open-ai-api").service("openAiApi").getSettings();
}

module.exports = ({ strapi }) => ({
  async createEmbedding(data) {
    const settings = await getSettings();

    // TODO: IMPLEMENT ERROR

    const plugin = await pluginManager.initialize(settings);
    const randomId = uuidv4();

    const docs = [
      new Document({
        metadata: { id: randomId },
        pageContent: data.data.content,
      }),
    ];

    const toJason = JSON.stringify(docs);
    const ids = await plugin.pineconeStore.addDocuments(docs);
    data.data.embeddingsId = ids[0];
    data.data.embeddings = toJason;

    return await strapi.entityService.create(
      "plugin::open-ai-api.embedding",
      data
    );
  },
  async deleteEmbedding(params) {
    const settings = await getSettings();
    const plugin = await pluginManager.initialize(settings);

    const currentEntry = await strapi.entityService.findOne(
      "plugin::open-ai-api.embedding",
      params.id
    );

    const ids = [currentEntry.embeddingsId];
    await plugin.pineconeStore.delete({ ids: ids });
    const delEntryResponse = await strapi.entityService.delete(
      "plugin::open-ai-api.embedding",
      params.id
    );

    return delEntryResponse;
  },
  async queryEmbeddings(data) {
    const emptyQuery = data?.query ? false : true;
    if (emptyQuery) return { error: "Please provide a query"}
    const settings = await getSettings();
    const plugin = await pluginManager.initialize(settings);
    
    const chain = VectorDBQAChain.fromLLM(plugin.model, pluginManager.pineconeStore, {
      k: 1,
      returnSourceDocuments: true,
    });

    const response = await chain.call({ query: data.query });
    return response;
  },
  async getEmbedding(ctx) {},
  async getEmbeddings(ctx) {},
});
