const { OpenAI } = require("langchain/llms/openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");

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
    this.pinecone = new PineconeClient();
    this.index = null;
  }

  async initializePinecone(environment, apiKey) {
    if (this.pinecone && this.index)
      return { pinecone: this.pinecone, index: this.index };

    try {
      await this.pinecone.init({ environment: environment, apiKey: apiKey });
      this.index = this.pinecone.Index("strapi-plugin"); // TODO: SET THIS IN SETTINGS
      return { pinecone: this.pinecone, index: this.index };
    } catch (error) {
      console.error(`Failed to initialize Pinecone: ${error}`);
    }
  }

  async initializeModel(apiKey) {
    if (this.model) return this.model
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

  async initializeEmbeddings(apiKey) {
    if(this.embeddings) return this.embeddings
    try {
      const config = {
        openAIApiKey: apiKey,
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
}

module.exports = new PluginManager();
