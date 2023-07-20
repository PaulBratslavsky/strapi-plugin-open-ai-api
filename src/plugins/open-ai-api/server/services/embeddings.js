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

    const db = await pluginManager.initializePinecone(
      settings.pineConeApiEnv,
      settings.pineConeApiKey
    );
    const embeddings = await pluginManager.initializeEmbeddings(
      settings.apiKey
    );
    const randomId = uuidv4();

    const docs = [
      new Document({
        metadata: { id: randomId },
        pageContent: data.data.content,
      }),
    ];

    const pineconeIndex = db.index;

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    const createdEmbeddings = await vectorStore.similaritySearch(
      "pinecone",
      undefined,
      {
        id: randomId,
      }
    );

    const toJason = JSON.stringify(createdEmbeddings);
    const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
    const ids = await pineconeStore.addDocuments(docs);

    data.data.embeddingsId = ids[0];
    data.data.embeddings = toJason;
    return await strapi.entityService.create(
      "plugin::open-ai-api.embedding",
      data
    );
  },

  async deleteEmbedding(params) {
    const settings = await getSettings();

    const db = await pluginManager.initializePinecone(
      settings.pineConeApiEnv,
      settings.pineConeApiKey
    );
    const embeddings = await pluginManager.initializeEmbeddings(
      settings.apiKey
    );

    const currentEntry = await strapi.entityService.findOne(
      "plugin::open-ai-api.embedding",
      params.id
    );

    const ids = [currentEntry.embeddingsId];
    const pineconeIndex = db.index;
    const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
    await pineconeStore.delete({ ids: ids });
    const delEntryResponse = await strapi.entityService.delete(
      "plugin::open-ai-api.embedding",
      params.id
    );

    console.log(delEntryResponse, "DELETE");
    return { message: "ok" };
  },
  async getEmbedding(ctx) {},
  async getEmbeddings(ctx) {},
});
