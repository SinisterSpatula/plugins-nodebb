'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const controllers = require('./lib/controllers');
const routeHelpers = require.main.require('./src/routes/helpers');
const User = require.main.require('./src/user');
const settings = require.main.require('./src/settings');

const plugin = {};

plugin.init = async (params) => {
  const { router /* , middleware , controllers */ } = params;
  // Your other initialization code...
  winston.info(`[plugins/avatargallery] initialized`);
};

plugin.activate = async function () {
  try {
    // Store the current setting
    const currentSetting = await settings.get('allowProfileImageUploads');
    await settings.set('pluginAvatarGallery:originalAvatarSetting', currentSetting);

    // Disable avatar uploads
    await settings.set('allowProfileImageUploads', 0);

    winston.info('[plugins/avatargallery] activated and avatar uploads disabled');
  } catch (err) {
    winston.info('[plugins/avatargallery] Error activating plugin:', err);
  }
};

plugin.deactivate = async function (params) {
  try {
    // Restore the original setting
    const originalSetting = await settings.get('pluginAvatarGallery:originalAvatarSetting');
    await settings.set('allowProfileImageUploads', originalSetting);

    // Clean up our stored setting
    await settings.delete('pluginAvatarGallery:originalAvatarSetting');

    // Your other deactivation code...
  } catch (err) {
    winston.info(`[plugins/avatargallery] Error deactivating plugin: ${err}`);
    return;
  }
  winston.info(`[plugins/avatargallery] plugin deactivated`);
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
