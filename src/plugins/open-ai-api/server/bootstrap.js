'use strict';

module.exports = async ({ strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'open-ai-api',
    },
    {
      section: 'plugins',
      displayName: 'Update',
      uid: 'update',
      pluginName: 'open-ai-api',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
