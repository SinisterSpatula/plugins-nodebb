'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const controllers = require('./lib/controllers');
const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};

plugin.init = async (params) => {
  const { router, middleware } = params;
  try {
    // Disable avatar uploads
    await meta.configs.set('allowProfileImageUploads', 0);

    // Set up the admin page route
    routeHelpers.setupAdminPageRoute(router, '/admin/plugins/avatargallery', controllers.renderAdminPage);

    // Set up the API routes
    const apiMiddleware = [middleware.authenticateRequest, middleware.ensureLoggedIn, middleware.admin.checkPrivileges];
    winston.info('[plugins/avatargallery] Setting up API routes');
    routeHelpers.setupApiRoute(router, 'post', '/avatargallery/add', apiMiddleware, controllers.addAvatar);
    routeHelpers.setupApiRoute(router, 'put', '/avatargallery/edit', apiMiddleware, controllers.editAvatar);
    routeHelpers.setupApiRoute(router, 'delete', '/avatargallery/delete', apiMiddleware, controllers.deleteAvatar);

    winston.info('[plugins/avatargallery] plugin initialized and avatar uploads disabled');
  } catch (err) {
    winston.warn('[plugins/avatargallery] Error initializing plugin:', err);
  }
};

plugin.activate = async function () {
  try {
    // Disable allowProfileImageUploads
    await meta.configs.set('allowProfileImageUploads', 0);
    // Set up routes for the admin page
    winston.info('[plugins/avatargallery] activated and avatar uploads disabled');
  } catch (err) {
    winston.warn('[plugins/avatargallery] Error activating plugin:', err);
  }
};

plugin.deactivate = async function (params) {
  try {
    // Enable allowProfileImageUploads
    await meta.configs.set('allowProfileImageUploads', 1);
    winston.info('[plugins/avatargallery] deactivated and avatar uploads enabled');
  } catch (err) {
    winston.warn(`[plugins/avatargallery] Error deactivating plugin: ${err}`);
    return;
  }
};

plugin.uploadImage = function (data) {
  // This hook is called when a user tries to upload a new profile picture
  winston.info('[plugins/avatargallery] uploadImage hook called');
  if (data.image.name === 'profileAvatar') {
    throw new Error('Unable to upload user profile images while avatargallery plugin is enabled.');
  }
  return data;
};

plugin.addAdminNavigation = function (header, callback) {
  header.plugins.push({
    route: '/plugins/avatargallery',
    icon: 'fa-picture-o',
    name: 'Avatar Gallery',
  });
  callback(null, header);
};

module.exports = plugin;
