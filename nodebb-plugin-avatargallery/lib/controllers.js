'use strict';

const winston = require.main.require('winston');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const db = require.main.require('./src/database');
const AVATAR_STORAGE_PATH = path.join(__dirname, '..', 'public', 'avatars');
const AVATAR_KEY = 'avatargallery:avatars';
const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res) {
  res.render('admin/plugins/avatargallery', {
    title: 'Avatar Gallery',
    avatars: [],
  });
};

async function saveOriginalImage(file) {
  const fileExtension = path.extname(file.originalFilename);
  const fileName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${fileExtension}`;
  const filePath = path.join(AVATAR_STORAGE_PATH, fileName);

  await fs.mkdir(AVATAR_STORAGE_PATH, { recursive: true });
  await fs.copyFile(file.path, filePath);

  return fileName;
}

async function processCroppedImage(file) {
  // Similar to saveOriginalImage, but with image processing if needed
  return await saveOriginalImage(file);
}

async function saveAvatarToDatabase(name, accessLevel, fileName) {
  let avatars = (await db.getObject(AVATAR_KEY)) || { nextId: 1, list: [] };

  const newAvatar = {
    id: avatars.nextId,
    name,
    accessLevel,
    fileName,
  };

  avatars.list.push(newAvatar);
  avatars.nextId++;

  await db.setObject(AVATAR_KEY, avatars);
  return newAvatar.id;
}

Controllers.addAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] addAvatar called');
  let { name, accessLevel, skipCropping } = req.body;
  let file = req.files.avatar;

  try {
    let fileName;
    if (skipCropping === 'true') {
      fileName = await saveOriginalImage(file);
    } else {
      fileName = await processCroppedImage(file);
    }

    const avatarId = await saveAvatarToDatabase(name, accessLevel, fileName);

    res.json({ success: true, message: 'Avatar added successfully', id: avatarId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.listAvatars = async function (req, res) {
  winston.info('[plugins/avatargallery] listAvatars called');
  try {
    const avatars = (await db.getObject(AVATAR_KEY)) || { list: [] };
    const accessLevelOrder = ['users', 'moderators', 'global_moderators', 'administrators'];

    const sortedAvatars = avatars.list
      .map((avatar) => ({
        ...avatar,
        path: `/assets/plugins/nodebb-plugin-avatargallery/avatars/${avatar.fileName}`,
      }))
      .sort((a, b) => {
        const accessLevelDiff = accessLevelOrder.indexOf(a.accessLevel) - accessLevelOrder.indexOf(b.accessLevel);
        if (accessLevelDiff !== 0) return accessLevelDiff;
        return a.name.localeCompare(b.name);
      });

    res.json({
      success: true,
      avatars: sortedAvatars,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.editAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] editAvatar called');
  const { id, name, accessLevel } = req.body;

  try {
    let avatars = await db.getObject(AVATAR_KEY);
    const avatarIndex = avatars.list.findIndex((a) => a.id === parseInt(id));

    if (avatarIndex === -1) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    avatars.list[avatarIndex].name = name;
    avatars.list[avatarIndex].accessLevel = accessLevel;

    await db.setObject(AVATAR_KEY, avatars);
    res.json({ success: true, message: 'Avatar updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.deleteAvatar = async function (req, res) {
  winston.info('[plugins/avatargallery] deleteAvatar called');
  const { id } = req.body;

  try {
    let avatars = await db.getObject(AVATAR_KEY);
    const avatarIndex = avatars.list.findIndex((a) => a.id === parseInt(id));

    if (avatarIndex === -1) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    const fileName = avatars.list[avatarIndex].fileName;
    await fs.unlink(path.join(AVATAR_STORAGE_PATH, fileName));

    avatars.list.splice(avatarIndex, 1);
    await db.setObject(AVATAR_KEY, avatars);

    res.json({ success: true, message: 'Avatar deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
