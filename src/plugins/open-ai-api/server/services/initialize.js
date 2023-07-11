const { OpenAI } = require("langchain/llms/openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
// const { MemoryVectorStore } = require("langchain/vectorstores/memory");


class PluginManager {
  constructor() {
    this.model = null;
    this.embeddings = null;
  }

  async configureModel(apiKey) {
    const model = new OpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3-turbo"
    });
    this.model = model;
    return this.model;
  }

  async configureEmbeddings(apiKey) {

    const config = {
      openAIApiKey: apiKey,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      maxTokens: 100,
    };

    const embeddings = new OpenAIEmbeddings(config);
    this.embeddings = embeddings;
    return this.embeddings;
  }

  async getModel() {
    return this.model;
  }
}



module.exports = new PluginManager();