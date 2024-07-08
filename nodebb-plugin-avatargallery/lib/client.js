'use strict';

define('avatargallery/client', ['api', 'alerts'], function (api, alerts) {
  const AvatarGallery = {};
  let selectedAvatarId = null;

  AvatarGallery.init = function (params) {
    const avatarGallery = $('#avatar-gallery');

    api
      .get('/plugins/avatargallery/list', {})
      .then((response) => {
        if (response && response.avatars) {
          renderAvatars(response.avatars);
          AvatarGallery.highlightSelected();
        }
      })
      .catch((error) => {
        alerts.error('Error loading avatars: ' + error.message);
      });

    avatarGallery.on('click', '.avatar-item', function () {
      const avatarId = $(this).data('id');
      AvatarGallery.selectAvatar(avatarId);
    });

    // Hook into the existing save button
    $('.modal-footer .btn-primary').on('click', AvatarGallery.saveSelectedAvatar);
  };

  function renderAvatars(avatars) {
    const html = avatars
      .map(
        (avatar) => `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
                <div class="avatar-item" data-id="${avatar.id}" data-name="${avatar.name}" data-access="${avatar.accessLevel}">
                    <img src="${avatar.path}" alt="${avatar.name}" class="img-fluid rounded">
                    <div class="avatar-name">${avatar.name}</div>
                </div>
            </div>
        `
      )
      .join('');
    $('#avatar-gallery').html(html);
  }

  AvatarGallery.highlightSelected = function () {
    const currentAvatar = ajaxify.data.picture;
    $('.avatar-item').removeClass('selected');
    $('.avatar-item').each(function () {
      if ($(this).find('img').attr('src') === currentAvatar) {
        $(this).addClass('selected');
      }
    });
  };

  AvatarGallery.selectAvatar = function (avatarId) {
    selectedAvatarId = avatarId;
    $('.avatar-item').removeClass('selected');
    $(`.avatar-item[data-id="${avatarId}"]`).addClass('selected');
  };

  AvatarGallery.saveSelectedAvatar = function () {
    if (selectedAvatarId) {
      api
        .put(`/users/${ajaxify.data.theirid}/picture`, {
          type: 'avatargallery',
          avatarId: selectedAvatarId,
        })
        .then(() => {
          alerts.success('Avatar updated successfully');
          ajaxify.refresh();
        })
        .catch((error) => {
          alerts.error('Error updating avatar: ' + error.message);
        });
    }
  };

  return AvatarGallery;
});
