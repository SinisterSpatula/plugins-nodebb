'use strict';

define('admin/plugins/avatargallery', ['api'], function (api) {
  var AvatarGallery = {};
  let avatarToDelete;
  let previousModal = null;

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
    $('#submit-avatar').on('click', function () {
      const payload = {
        name: $('#avatar-name').val(),
        file: $('#avatar-file')[0].files[0],
        accessLevel: $('#avatar-access').val(),
      };

      if (!payload.name) {
        showError('Please enter a name for the avatar');
        return;
      }
      if (!payload.file) {
        showError('Please select an image to upload');
        return;
      }
      if (!['users', 'moderators', 'global_moderators', 'administrators'].includes(payload.accessLevel)) {
        showError('Please select an access level for the avatar');
        return;
      }
      $.ajax({
        url: '/plugins/avatargallery/add',
        type: 'POST',
        data: payload,
        success: function(response) {
          // Add the new avatar to the UI
          $('#addAvatarModal').modal('hide');
          resetSearch();
        },
        error: function(error) {
          // Handle error
          showError('Error adding avatar:', error.responseText);
          console.log(error);
        }
      });
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

    console.log('Avatar Gallery loaded admin panel script initialized!');
  };

  return AvatarGallery;
});
