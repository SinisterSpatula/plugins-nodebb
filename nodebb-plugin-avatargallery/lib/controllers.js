'use strict';

const winston = require.main.require('winston');
const path = require('path');
const crypto = require('crypto');
const db = require.main.require('./src/database');
const file = require.main.require('./src/file');
const nconf = require.main.require('nconf');
const user = require.main.require('./src/user');
const Controllers = module.exports;
const AVATAR_KEY = 'avatargallery:avatars';

Controllers.renderAdminPage = function (req, res) {
  res.render('admin/plugins/avatargallery', {
    title: 'Avatar Gallery',
    avatars: [],
  });
};

async function saveOriginalImage(uploadedFile) {
  const fileName = `${crypto.randomBytes(4).toString('hex')}${path.extname(uploadedFile.name)}`;
  const uploadResult = await file.saveFileToLocal(fileName, 'avatars', uploadedFile.path);
  return {
    url: nconf.get('relative_path') + uploadResult.url,
    path: uploadResult.path,
  };
}

async function processCroppedImage(uploadedFile) {
  // If cropping is needed, implement it here before saving
  return await saveOriginalImage(uploadedFile);
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
  try {
    const avatars = (await db.getObject(AVATAR_KEY)) || { list: [] };
    const userAccessLevel = await getUserAccessLevel(req.uid);
    const accessLevelOrder = ['users', 'moderators', 'global_moderators', 'administrators'];

    const sortedAvatars = avatars.list
      .map((avatar) => ({
        ...avatar,
        path: avatar.fileName.url,
      }))
      .sort((a, b) => {
        const accessLevelDiff = accessLevelOrder.indexOf(a.accessLevel) - accessLevelOrder.indexOf(b.accessLevel);
        if (accessLevelDiff !== 0) return accessLevelDiff;
        return a.name.localeCompare(b.name);
      });

    const filteredAvatars = filterAvatarsByAccessLevel(sortedAvatars, userAccessLevel);
    res.json({ success: true, avatars: filteredAvatars });
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

    const avatarPath = avatars.list[avatarIndex].fileName.path;
    winston.info(`[plugins/avatargallery] Deleting avatar ${avatarPath}`);
    await file.delete(avatarPath);

    avatars.list.splice(avatarIndex, 1);
    await db.setObject(AVATAR_KEY, avatars);

    res.json({ success: true, message: 'Avatar deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

Controllers.updateUserPicture = async function (req, res) {
  const { uid } = req.params;
  const { avatarId } = req.body;

  try {
    const avatars = await db.getObject(AVATAR_KEY);
    const avatar = avatars.list.find((a) => a.id === parseInt(avatarId));

    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    const userAccessLevel = await getUserAccessLevel(req.uid);
    if (!isAvatarAccessible(avatar, userAccessLevel)) {
      return res.status(403).json({ error: 'You do not have permission to use this avatar' });
    }

    await user.setUserField(uid, 'picture', avatar.fileName.url);
    await user.setUserField(uid, 'uploadedpicture', avatar.fileName.url);

    res.json({ success: true, message: 'Avatar updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getUserAccessLevel(uid) {
  const [isAdmin, isGlobalMod, isModerator] = await Promise.all([user.isAdministrator(uid), user.isGlobalModerator(uid), user.isModerator(uid)]);

  if (isAdmin) return 'administrators';
  if (isGlobalMod) return 'global_moderators';
  if (isModerator) return 'moderators';
  return 'users';
}

function filterAvatarsByAccessLevel(avatars, userAccessLevel) {
  const accessLevels = ['users', 'moderators', 'global_moderators', 'administrators'];
  const userLevelIndex = accessLevels.indexOf(userAccessLevel);
  return avatars.filter((avatar) => accessLevels.indexOf(avatar.accessLevel) <= userLevelIndex);
}

function isAvatarAccessible(avatar, userAccessLevel) {
  const accessLevels = ['users', 'moderators', 'global_moderators', 'administrators'];
  return accessLevels.indexOf(avatar.accessLevel) <= accessLevels.indexOf(userAccessLevel);
}
