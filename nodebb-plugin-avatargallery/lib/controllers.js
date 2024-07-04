'use strict';

const winston = require.main.require('winston');
const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res) {
  res.render('admin/plugins/avatargallery', {
    title: 'Avatar Gallery',
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
};

Controllers.addAvatar = async function (req, res) {
  // pull out the Name, File and accessLevel from body
  let { name, file, accessLevel } = req.body;
  winston.info('[plugins/avatargallery] addAvatar called');
  winston.info('[plugins/avatargallery] Name:', name);
  winston.info('[plugins/avatargallery] File:', file);
  winston.info('[plugins/avatargallery] AccessLevel:', accessLevel);
  try {
    // Implementation for adding an avatar
    // Access form data via req.body
    // Handle file upload
    // Save to database
    res.json({ success: true, message: 'Avatar added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.editAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] editAvatar called');
  winston.info('[plugins/avatargallery] req.body:', JSON.stringify(req.body));
  try {
    // Implementation for editing an avatar
    // Access data via req.body
    // Update in database
    res.json({ success: true, message: 'Avatar updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.deleteAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] deleteAvatar called');
  winston.info('[plugins/avatargallery] req.body:', JSON.stringify(req.body));
  try {
    // Implementation for deleting an avatar
    // Access avatar ID via req.params.id
    // Delete from database
    res.json({ success: true, message: 'Avatar deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
