'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const controllers = require('./lib/controllers');
const routeHelpers = require.main.require('./src/routes/helpers');
const User = require.main.require('./src/user');

const plugin = {};

plugin.init = async (params) => {
  const { router /* , middleware , controllers */ } = params;
  winston.info(`[plugins/avatargallery] initialized`);
};

plugin.uploadImage = function (data) {
  // This hook is called when a user tries to upload a new profile picture
  winston.info('[plugins/avatargallery] uploadImage hook called');
  if (data.image.name === 'profileAvatar') {
    throw new Error('Unable to upload user profile images while avatargallery plugin is enabled.');
  }
  return data;
};

module.exports = plugin;
