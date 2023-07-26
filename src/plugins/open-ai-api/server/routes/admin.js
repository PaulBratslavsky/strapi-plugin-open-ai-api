module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'myController.index',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/update-settings',
      handler: 'openAiApi.updateSettings',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.update'] }
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/get-settings',
      handler: 'openAiApi.getSettings',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.read'] }
          },
        ]
      },
    },
    {
      method: 'POST',
      path: '/embeddings/create-embedding',
      handler: 'openAiApi.createEmbedding',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.create'] }
          },
        ]
      },
    },
    {
      method: 'DELETE',
      path: '/embeddings/delete-embedding/:id',
      handler: 'openAiApi.deleteEmbedding',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.delete'] }
          },
        ]
      },
    },
    {
      method: 'GET',
      path: '/embeddings/embeddings-query',
      handler: 'openAiApi.queryEmbeddings',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.chat'] }
          },
        ]
      },
    },
    {
      method: 'GET',
      path: '/embeddings/find',
      handler: 'openAiApi.getEmbeddings',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.read'] }
          },
        ]
      },
    },
    {
      method: 'GET',
      path: '/embeddings/find/:id',
      handler: 'openAiApi.getEmbeddings',
      config: {
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: ['plugin::open-ai-api.read'] }
          },
        ]
      },
    }
  ]
};
