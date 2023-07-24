// @ts-nocheck
const pluginManager = require("./initialize");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { Document } = require("langchain/document");
const { v4: uuidv4 } = require("uuid");

async function getSettings() {
  return await strapi.plugin("open-ai-api").service("openAiApi").getSettings();
}

module.exports = ({ strapi }) => ({
  async createEmbedding(data) {
    const settings = await getSettings();
    const plugin = await pluginManager.initialize(settings);
    const randomId = uuidv4();

    const docs = [
      new Document({
        metadata: { id: randomId },
        pageContent: data.data.content,
      }),
    ];

    const toJason = JSON.stringify(docs);
    const ids = await plugin.piniconeStore.addDocuments(docs);
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
    await plugin.piniconeStore.delete({ ids: ids });
    const delEntryResponse = await strapi.entityService.delete(
      "plugin::open-ai-api.embedding",
      params.id
    );

    return delEntryResponse;
  },
  async getEmbedding(ctx) {},
  async getEmbeddings(ctx) {},
});
