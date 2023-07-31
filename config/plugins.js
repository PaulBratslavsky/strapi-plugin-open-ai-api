module.exports = ({ env }) => ({
  'open-ai-embeddings': {
    enabled: true,
    resolve: './src/plugins/open-ai-embeddings',
    config: {
      openAiApiKey: env('OPEN_AI_API_KEY'),
      openAiModelName: env('OPEN_AI_MODEL_NAME'),
      pineconeApiKey:  env('PINECONE_API_KEY'),
      pineconeApiEnv: env('PINECONE_API_ENV'),
      pineconeIndex: env('PINECONE_INDEX'),
    },
  },
});