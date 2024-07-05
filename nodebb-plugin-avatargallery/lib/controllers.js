'use strict';

const winston = require.main.require('winston');
const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res) {
  res.render('admin/plugins/avatargallery', {
    title: 'Avatar Gallery',
    avatars: [],
  });
};

Controllers.addAvatar = async function (req, res) {
  let { name, file, accessLevel } = req.body;
  winston.info('[plugins/avatargallery] addAvatar called');
  winston.info(`[plugins/avatargallery] Name: ${name}`);
  winston.info(`[plugins/avatargallery] File: ${JSON.stringify(file)}`);
  winston.info(`[plugins/avatargallery] AccessLevel: ${accessLevel}`);
  try {
    // Implementation for adding an avatar
    res.json({ success: true, message: 'Avatar added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.editAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] editAvatar called');
  try {
    // Implementation for editing an avatar
    res.json({ success: true, message: 'Avatar updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.deleteAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] deleteAvatar called');
  try {
    // Implementation for deleting an avatar
    res.json({ success: true, message: 'Avatar deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.listAvatars = async function (req, res) {
  winston.info('[plugins/avatargallery] listAvatars called');
  try {
    // Implementation for listing avatars
    res.json({
      success: true,
      avatars: [
        {
          id: 1,
          name: 'Smiling Sunflower',
          path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
          accessLevel: 'users',
        },
        {
          id: 2,
          name: 'Cosmic Nebula',
          path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
          accessLevel: 'moderators',
        },
        {
          id: 3,
          name: 'Majestic Unicorn',
          path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
          accessLevel: 'global_moderators',
        },
        {
          id: 4,
          name: 'Serene Waterfall',
          path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
          accessLevel: 'users',
        },
        {
          id: 5,
          name: 'Enchanted Forest',
          path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
          accessLevel: 'moderators',
        },
        {
          id: 6,
          name: 'Mystical Dragon',
          path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
          accessLevel: 'global_moderators',
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
