'use strict';

const { head } = require('../../../src/request');
const uploader = require('uploader');

define('admin/plugins/avatargallery', ['api', 'cropperjs', 'bootbox', 'alerts'], function (api, Cropper, bootbox, alerts) {
  var AvatarGallery = {};
  let avatarToDelete;
  let cropper;

  AvatarGallery.init = async function () {
    $('#add-avatar').on('click', function () {
      app.parseAndTranslate('admin/plugins/addavatar_modal', {}, function (html) {
        var modal = bootbox.dialog({
          title: 'Add New Avatar',
          message: html,
          size: 'large',
          buttons: {
            save: {
              label: 'Finish',
              className: 'btn-primary',
              callback: saveAvatar,
            },
          },
        });

        var fileInput = modal.find('#avatar-file-input');
        var cropperContainer = modal.find('#cropper-container');
        var cropperImage = modal.find('#cropper-image');
        var skipCropping = modal.find('#skip-cropping');

        fileInput.on('change', function (e) {
          var file = e.target.files[0];
          if (file) {
            skipCropping.removeAttr('disabled');
            var reader = new FileReader();
            reader.onload = function (e) {
              cropperContainer.removeClass('d-none');
              cropperImage.attr('src', e.target.result);

              if (cropper) {
                cropper.destroy();
              }
              cropper = new Cropper(cropperImage[0], {
                aspectRatio: 1,
                autoCropArea: 1,
                viewMode: 1,
                minCropBoxWidth: 256,
                minCropBoxHeight: 256,
                preview: '#cropper-preview',
              });
            };
            reader.readAsDataURL(file);
          }
        });
        cropperContainer.find('.rotate').on('click', function () {
          const degrees = parseInt(this.getAttribute('data-degrees'), 10);
          cropper.rotate(degrees);
        });

        cropperContainer.find('.reset').on('click', function () {
          cropper.reset();
        });

        cropperContainer.find('.flip').on('click', function () {
          const option = parseInt(this.getAttribute('data-option'), 10);
          const method = this.getAttribute('data-method');
          if (method === 'scaleX') {
            cropper.scaleX(option);
          } else {
            cropper.scaleY(option);
          }
          this.setAttribute('data-option', option * -1);
        });
        $('#skip-cropping').change(function () {
          $('#cropper-container').toggle();
          cropper.reset();
        });
      });
    });

    function saveAvatar() {
      var modal = $(this).closest('.modal');
      var avatarName = modal.find('#avatar-name').val();
      var accessLevel = modal.find('#avatar-access').val();

      if (!avatarName || !accessLevel || !cropper) {
        return alerts.error('Please fill all fields and crop an image');
      }

      cropper.getCroppedCanvas().toBlob(function (blob) {
        var formData = new FormData();
        formData.append('avatar', blob, 'avatar.png');
        formData.append('name', avatarName);
        formData.append('accessLevel', accessLevel);

        api
          .post('/plugins/avatargallery/add', formData)
          .then(function (response) {
            modal.modal('hide');
            refreshAvatarList();
            alerts.success('Avatar added to gallery successfully');
          })
          .catch(function (error) {
            alerts.error('Error uploading avatar: ' + error.message);
          });
      });
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
          alerts.error('Error refreshing avatar list: ' + error.message);
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
        alerts.error('Please select an avatar to edit');
        return;
      }
      if (newName == '' || newName == 'undefined' || newName == 'null') {
        alerts.error('Please enter a name for the avatar');
        return;
      }
      if (newAccess !== 'users' && newAccess !== 'moderators' && newAccess !== 'global_moderators' && newAccess !== 'administrators') {
        alerts.error('Please select an access level for the avatar');
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
          alerts.success('Avatar updated successfully');
        })
        .catch((error) => {
          // Handle error
          alerts.error('Error updating avatar:', error.message);
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
            alerts.success('Avatar deleted successfully');
          })
          .catch((error) => {
            // Handle error
            alerts.error('Error deleting avatar:', error.message);
          });
      }
    });

    refreshAvatarList();
    console.log('Avatar Gallery loaded admin panel script initialized!');
  };

  return AvatarGallery;
});
