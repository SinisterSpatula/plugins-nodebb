'use strict';

const { head } = require('../../../src/request');
const uploader = require('uploader');

define('admin/plugins/avatargallery', ['api', 'pictureCropper'], function (api, pictureCropper) {
  var AvatarGallery = {};
  let avatarToDelete;
  let previousModal = null;
  let croppedImageBlob;

  function showError(message) {
    // Store the currently open modal
    previousModal = $('.modal:visible').attr('id');
    // hide any visible modals first.
    $('#errorModal').modal('hide');
    $('#addAvatarModal').modal('hide');
    $('#editAvatarModal').modal('hide');
    $('#deleteAvatarModal').modal('hide');
    $('#errorMessage').text(message);
    $('#errorModal').modal('show');
    $('#errorModal').on('hidden.bs.modal', function () {
      if (previousModal) {
        $(`#${previousModal}`).modal('show');
        previousModal = null;
      }
    });
  }

  AvatarGallery.init = function () {
    $('#add-avatar').on('click', function () {
      pictureCropper.show(
        {
          title: 'Add New Avatar',
          socketMethod: 'plugins.avatargallery.uploadAvatar',
          aspectRatio: 1,
          allowSkippingCrop: false,
          restrictImageDimension: true,
          imageDimension: 256,
          paramName: 'avatar',
          fileSize: 2048,
        },
        function (imageUrl) {
          showAvatarDetailsModal(imageUrl);
        }
      );
    });

    function showAvatarDetailsModal(imageUrl) {
      app.parseAndTranslate('plugins/avatargallery/partials/avatar_details', {}, function (html) {
        const modal = bootbox.dialog({
          title: 'Avatar Details',
          message: html,
          buttons: {
            save: {
              label: 'Save Avatar',
              className: 'btn-primary',
              callback: function () {
                saveAvatar(imageUrl, modal);
              },
            },
          },
        });
      });
    }

    function saveAvatar(imageUrl, modal) {
      const avatarName = modal.find('#avatar-name').val();
      const accessLevel = modal.find('#avatar-access').val();

      if (!avatarName) {
        return showError('Please enter a name for the avatar');
      }

      api.post(
        '/plugins/avatargallery/add',
        {
          name: avatarName,
          accessLevel: accessLevel,
          imageData: imageUrl,
        },
        function (err, response) {
          if (err) {
            showError('Error saving avatar: ' + err.message);
          } else {
            modal.modal('hide');
            refreshAvatarList();
          }
        }
      );
    }

    function refreshAvatarList() {
      api
        .get('/plugins/avatargallery/list', {})
        .then((response) => {
          const container = $('#avatar-container');
          container.empty();
          response.avatars.forEach((avatar) => {
            const avatarHtml = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div class="card h-100">
                <img src="${avatar.path}" class="card-img-top" alt="${avatar.name}">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${avatar.name}</h5>
                  <div class="card-text">
                    <span class="fw-bold">Access:</span>
                    <small class="fst-italic text-muted">${avatar.accessLevel}</small>
                  </div>
                  <div class="d-flex mt-auto w-100">
                    <button type="button" class="btn btn-sm btn-outline-primary edit-avatar w-50 me-1" data-id="${avatar.id}">Edit</button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-avatar w-50 ms-1" data-id="${avatar.id}">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          `;
            container.append(avatarHtml);
          });
        })
        .catch((error) => {
          showError('Error refreshing avatar list: ' + error.message);
        });
    }

    // When the delete button is clicked, show the confirmation modal
    $('#avatar-container').on('click', '.delete-avatar', function () {
      avatarToDelete = $(this).data('id');
      $('#deleteAvatarModal').modal('show');
    });

    $('#avatar-search').on('input', function () {
      const searchTerm = $(this).val().toLowerCase();
      filterAvatars(searchTerm);
    });

    function resetSearch() {
      $('#avatar-search').val('');
      $('#avatar-container .col-12').show();
    }

    function filterAvatars(searchTerm) {
      $('#avatar-container .col-12').each(function () {
        const card = $(this);
        const avatarName = card.find('.card-title').text().toLowerCase();
        const avatarAccess = card.find('.card-text small').text().toLowerCase();

        if (avatarName.includes(searchTerm) || avatarAccess.includes(searchTerm)) {
          card.show();
        } else {
          card.hide();
        }
      });
    }

    // When the edit button is clicked, show the edit modal
    $('#avatar-container').on('click', '.edit-avatar', function () {
      var avatarId = $(this).data('id');
      var card = $(this).closest('.card');
      var currentName = card.find('.card-title').text();
      var currentAccess = card.find('.card-text small').text();

      $('#edit-avatar-id').val(avatarId);
      $('#edit-avatar-name').val(currentName);
      $('#edit-avatar-access').val(currentAccess.toLowerCase().replace(/ /g, '_'));
      $('#editAvatarModal').modal('show');
    });

    $('#submit-edit-avatar').on('click', function () {
      var avatarId = $('#edit-avatar-id').val();
      var newName = $('#edit-avatar-name').val();
      var newAccess = $('#edit-avatar-access').val();

      if (avatarId == '' || avatarId == 'undefined' || avatarId == 'null') {
        showError('Please select an avatar to edit');
        return;
      }
      if (newName == '' || newName == 'undefined' || newName == 'null') {
        showError('Please enter a name for the avatar');
        return;
      }
      if (newAccess !== 'users' && newAccess !== 'moderators' && newAccess !== 'global_moderators' && newAccess !== 'administrators') {
        showError('Please select an access level for the avatar');
        return;
      }
      // Add your AJAX call here to submit the updated avatar info to your backend
      console.log('Updating avatar:', { id: avatarId, name: newName, accessLevel: newAccess });
      api
        .put('/plugins/avatargallery/edit', { id: avatarId, name: newName, accessLevel: newAccess })
        .then((response) => {
          // Update UI
          var card = $('[data-id="' + avatarId + '"]').closest('.card');
          card.find('.card-title').text(newName);
          card.find('.card-text small').text(newAccess.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));
          $('#editAvatarModal').modal('hide');
          resetSearch();
        })
        .catch((error) => {
          // Handle error
          showError('Error updating avatar:', error.message);
        });
    });

    // When the delete is confirmed in the modal
    $('#confirm-delete-avatar').on('click', function () {
      if (avatarToDelete) {
        // Add your AJAX call here to delete the avatar
        console.log('Deleting avatar with ID:', avatarToDelete);
        api
          .del('/plugins/avatargallery/delete', { id: avatarToDelete })
          .then((response) => {
            // Remove the avatar from the UI
            $('[data-id="' + avatarToDelete + '"]')
              .closest('.col-12')
              .remove();
            $('#deleteAvatarModal').modal('hide');
            resetSearch();
          })
          .catch((error) => {
            // Handle error
            showError('Error deleting avatar:', error.message);
          });
      }
    });

    refreshAvatarList();
    console.log('Avatar Gallery loaded admin panel script initialized!');
  };

  return AvatarGallery;
});
