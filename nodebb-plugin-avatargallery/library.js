'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const plugin = {};

plugin.init = async (params) => {
  // const { router } = params;
  // // Override the route that serves the modal template
  // router.get('/templates/modals/change_picture.tpl', (req, res) => {
  //   res.render('custom_change_picture', {
  //     // Your custom data here
  //   });
  // });
};

plugin.addAdminNavigation = (header) => {
  header.plugins.push({
    route: '/plugins/avatargallery',
    icon: 'fa-image',
    name: 'Avatar Gallery',
  });

  return header;
};

module.exports = plugin;
