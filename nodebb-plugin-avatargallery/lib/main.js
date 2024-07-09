'use strict';

define('forum/avatargallery', ['api', 'alerts', 'hooks'], function (api, alerts, hooks) {
  hooks.on('action:ajaxify.end', () => {
    if (ajaxify.data.template.name == 'account/profile') {
      handleProfilePage();
    }
  });

  function handleProfilePage() {
    $('[component="profile/change/picture"]')
      .off()
      .on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        openAvatarGalleryModal();
        return false;
      });
  }

  function openAvatarGalleryModal() {
    api
      .get('/plugins/avatargallery/list', {})
      .then((response) => {
        const avatars = response.avatars;

        app.parseAndTranslate('modals/change-picture', {}, (html) => {
          const modal = bootbox.dialog({
            title: 'Change Picture',
            message: html,
            size: 'large',
          });

          const avatarGallery = modal.find('#avatar-gallery');
          avatars.forEach((avatar) => {
            const avatarElement = $(`
            <div class="col-md-3 col-sm-4 col-6 mb-3">
              <div class="avatar-item" data-avatar-id="${avatar.id}">
                <img src="${avatar.path}" alt="${avatar.name}" class="img-fluid rounded">
                <p class="text-center mt-2">${avatar.name}</p>
              </div>
            </div>
          `);
            avatarGallery.append(avatarElement);
          });

          handleAvatarSelection(modal);
        });
      })
      .catch((error) => {
        console.error('Error fetching avatars:', error);
        alerts.error('Failed to load avatars');
      });
  }

  function handleAvatarSelection(modal) {
    const avatarItems = modal.find('.avatar-item');
    const saveButton = modal.find('[data-action="upload"]');
    let selectedAvatarId = null;

    avatarItems.on('click', function () {
      avatarItems.removeClass('active');
      $(this).addClass('active');
      selectedAvatarId = $(this).data('avatar-id');
    });

    saveButton.on('click', function () {
      if (selectedAvatarId) {
        api
          .put(`/users/${ajaxify.data.theirid}/picture`, { avatarId: selectedAvatarId })
          .then(() => {
            modal.modal('hide');
            ajaxify.refresh();
          })
          .catch((error) => {
            console.error('Error updating avatar:', error);
            alerts.error('Failed to update avatar');
          });
      } else {
        alerts.error('Please select an avatar');
      }
    });
  }
});
