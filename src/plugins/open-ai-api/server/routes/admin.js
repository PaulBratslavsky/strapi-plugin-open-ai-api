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
  ]
};
