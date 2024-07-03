'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const controllers = require('./lib/controllers');
const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};

plugin.init = async (params) => {
  const { router /* , middleware , controllers */ } = params;
  try {
    // Disable avatar uploads
    await meta.configs.set('allowProfileImageUploads', 0);

    routeHelpers.setupPageRoute(
      router,
      '/avatargallery',
      [
        (req, res, next) => {
          winston.info(`[plugins/avatargallery] In middleware. This argument can be either a single middleware or an array of middlewares`);
          setImmediate(next);
        },
      ],
      (req, res) => {
        winston.info(`[plugins/avatargallery] Navigated to ${nconf.get('relative_path')}/avatargallery`);
        res.render('avatargallery', { uid: req.uid });
      }
    );

    routeHelpers.setupAdminPageRoute(router, '/admin/plugins/avatargallery', controllers.renderAdminPage);

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

plugin.addRoutes = async ({ router, middleware, helpers }) => {
  const middlewares = [
    middleware.ensureLoggedIn,
    // middleware.admin.checkPrivileges
  ];
  // Set up the API routes
  winston.info('[plugins/avatargallery] addRoutes called');
  routeHelpers.setupApiRoute(router, 'post', '/avatargallery/add', middlewares, (req, res) => {
    helpers.formatApiResponse(200, res, {
      foobar: req.params.param1,
    });
  });
  routeHelpers.setupApiRoute(router, 'put', '/avatargallery/edit', middlewares, controllers.editAvatar);
  routeHelpers.setupApiRoute(router, 'delete', '/avatargallery/delete', middlewares, controllers.deleteAvatar);
};

plugin.addAdminNavigation = (header) => {
  header.plugins.push({
    route: '/plugins/avatargallery',
    icon: 'fa-picture-o',
    name: 'Avatar Gallery',
  });
  return header;
};

module.exports = plugin;
