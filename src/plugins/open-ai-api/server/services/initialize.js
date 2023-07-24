const { OpenAI } = require("langchain/llms/openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("langchain/vectorstores/pinecone");

function hasValidKeys(obj) {
  const requiredKeys = ["apiKey", "projectName", "environment"];
  for (let key of requiredKeys) {
    if (!obj.hasOwnProperty(key) || obj[key] === null) return false;
  }
  return true;
}

class PluginManager {
  constructor() {
    this.model = null;
    this.embeddings = null;
    this.index = null;
    this.piniconeStore = null;
    this.pinecone = null;
  }

  async initializePinecone(pineconeEnv, pineconeKey, indexName) {
    if (this.pinecone && this.index)
      return { pinecone: this.pinecone, index: this.index };
    try {
      this.pinecone = new PineconeClient();
      await this.pinecone.init({ environment: pineconeEnv, apiKey: pineconeKey });
      this.index = this.pinecone.Index(indexName);
      return { pinecone: this.pinecone, index: this.index, piniconeStore: this.piniconeStore };
    } catch (error) {
      console.error(`Failed to initialize Pinecone: ${error}`);
    }
  }

  async initializeEmbeddings(openAIApiKey) {
    if (this.embeddings) return this.embeddings;
    try {
      const config = {
        openAIApiKey: openAIApiKey,
        model: "text-embedding-ada-002",
        maxTokens: 8000,
      };

      const embeddings = new OpenAIEmbeddings(config);
      this.embeddings = embeddings;
      return this.embeddings;
    } catch (error) {
      console.error(`Failed to initialize Embeddings: ${error}`);
    }
  }

  async initializePineconeStore() {
    if (this.piniconeStore) return this.piniconeStore;
    try {
      this.piniconeStore = new PineconeStore(this.embeddings, {
        pineconeIndex: this.index,
      });
      return this.piniconeStore;
    } catch (error) {
      console.error(`Failed to initialize Pinecone Store: ${error}`);
    }
  }

  async initialize(settings) {
    await this.initializePinecone(settings.pineConeApiEnv, settings.pineConeApiKey, "strapi-plugin");
    await this.initializeEmbeddings(settings.apiKey);
    await this.initializePineconeStore();
    return { pinecone: this.pinecone, pineconeIndex: this.index, piniconeStore: this.piniconeStore };
  }


  async initializeModel(apiKey) {
    if (this.model) return this.model;
    try {
      const model = new OpenAI({
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo",
      });
      this.model = model;
      return this.model;
    } catch (error) {
      console.error(`Failed to initialize Model: ${error}`);
    }
  }

  async getModel() {
    if (!this.model) {
      throw new Error("Model is not initialized");
    }
    return this.model;
  }

  async getPinecone() {
    if (!this.pinecone || !hasValidKeys(this.pinecone)) return null;
    return { pinecone: this.pinecone, index: this.index };
  }

  async getEmbeddings() {
    if (!this.embeddings) {
      throw new Error("Embeddings are not initialized");
    }
    return this.embeddings;
  }

  async getPineconeStore() {
    if (!this.piniconeStore) {
      throw new Error("Pinecone Store is not initialized");
    }
    return this.piniconeStore;
  }
}

module.exports = new PluginManager();
