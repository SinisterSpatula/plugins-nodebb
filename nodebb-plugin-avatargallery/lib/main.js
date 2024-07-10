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
            title: '[[user:change-picture]]',
            message: html,
            size: 'large',
            buttons: {
              save: {
                label: '[[global:save-changes]]',
                className: 'btn-primary',
                callback: saveAvatarSelection,
              },
            },
          });

          const avatarGallery = $(`
            <div class="avatar-gallery-container" style="max-height: 460px; overflow-y: auto; overflow-x: hidden;">
              <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 me-2" id="avatar-gallery"></div>
            </div>
          `);

          modal.find('.modal-body').append(avatarGallery);

          avatars.forEach((avatar) => {
            const avatarElement = $(`
              <div class="col">
                <div class="avatar-item position-relative" data-avatar-id="${avatar.id}">
                  <img src="${avatar.path}" alt="${avatar.name}" class="img-fluid rounded">
                  <p class="text-center mt-2 small fw-semibold">${avatar.name}</p>
                  <div class="avatar-selection-indicator d-none position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-25 d-flex justify-content-center align-items-center">
                    <i class="fa fa-check fa-2x text-white"></i>
                  </div>
                </div>
              </div>
            `);
            avatarGallery.find('#avatar-gallery').append(avatarElement);
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
    const avatarItems = modal.find('#avatar-gallery .avatar-item');

    avatarItems.on('click', function () {
      avatarItems.removeClass('active');
      avatarItems.find('.avatar-selection-indicator').addClass('d-none');
      $(this).addClass('active');
      $(this).find('.avatar-selection-indicator').removeClass('d-none');
    });
  }

  function saveAvatarSelection() {
    const selectedAvatarUrl = $('.avatar-item.active img').attr('src');
    console.log('selectedAvatarUrl', selectedAvatarUrl);
    if (selectedAvatarUrl) {
      api
        .put(`/users/${ajaxify.data.theirid}/picture`, {
          type: 'external',
          url: selectedAvatarUrl,
        })
        .then(() => {
          ajaxify.refresh();
        })
        .catch((error) => {
          console.error('Error updating avatar:', error);
          alerts.error('Failed to update avatar');
        });
    } else {
      alerts.error('Please select an avatar');
      return false; // Prevent modal from closing
    }
  }
});
