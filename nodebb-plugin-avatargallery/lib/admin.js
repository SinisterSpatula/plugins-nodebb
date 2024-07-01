'use strict';

define('admin/plugins/avatargallery', ['api'], function (api) {
  var AvatarGallery = {};
  let avatarToDelete;

  AvatarGallery.init = function () {
    $('#submit-avatar').on('click', function () {
      var formData = new FormData();
      formData.append('name', $('#avatar-name').val());
      formData.append('file', $('#avatar-file')[0].files[0]);
      formData.append('accessLevel', $('#avatar-access').val());

      // Add your AJAX call here to submit the new avatar to your backend
      // Example:
      // api.post('/admin/plugins/avatargallery/add', formData)
      //   .then((response) => {
      //     // Add the new avatar to the UI
      //     addAvatarToUI(response);
      //     $('#addAvatarModal').modal('hide');
      //   })
      //   .catch((error) => {
      //     // Handle error
      //     console.error('Error adding avatar:', error);
      //   });

      // For now, let's just log and hide the modal
      console.log('Adding avatar:', formData);
      $('#addAvatarModal').modal('hide');
    });

    // When the delete button is clicked, show the confirmation modal
    $('#avatar-container').on('click', '.delete-avatar', function () {
      avatarToDelete = $(this).data('id');
      $('#deleteAvatarModal').modal('show');
    });

    $('#avatar-search').on('input', function () {
      // Handle search/filtering
      console.log('Searching for ' + $(this).val());
    });

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

      // Add your AJAX call here to submit the updated avatar info to your backend
      // Example:
      // api.put('/admin/plugins/avatargallery/edit', { id: avatarId, name: newName, accessLevel: newAccess })
      //   .then((response) => {
      //     // Update UI
      //     var card = $('[data-id="' + avatarId + '"]').closest('.card');
      //     card.find('.card-title').text(newName);
      //     card.find('.card-text small').text(newAccess.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      //     $('#editAvatarModal').modal('hide');
      //   })
      //   .catch((error) => {
      //     // Handle error
      //     console.error('Error updating avatar:', error);
      //   });

      // For now, let's just log and hide the modal
      console.log('Updating avatar:', { id: avatarId, name: newName, accessLevel: newAccess });
      $('#editAvatarModal').modal('hide');
    });

    // When the delete is confirmed in the modal
    $('#confirm-delete-avatar').on('click', function () {
      if (avatarToDelete) {
        // Add your AJAX call here to delete the avatar
        // Example:
        // api.del('/admin/plugins/avatargallery/delete', { id: avatarToDelete })
        //   .then((response) => {
        //     // Remove the avatar from the UI
        //     $('[data-id="' + avatarToDelete + '"]').closest('.col-12').remove();
        //     $('#deleteAvatarModal').modal('hide');
        //   })
        //   .catch((error) => {
        //     // Handle error
        //     console.error('Error deleting avatar:', error);
        //   });

        // For now, let's just log and hide the modal
        console.log('Deleting avatar with ID:', avatarToDelete);
        $('#deleteAvatarModal').modal('hide');
      }
    });

    console.log('Avatar Gallery loaded admin panel script initialized!');
  };

  return AvatarGallery;
});
