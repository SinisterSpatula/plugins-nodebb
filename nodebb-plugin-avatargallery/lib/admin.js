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
      // $.ajax({
      //     url: '/api/admin/plugins/avatargallery/add',
      //     type: 'POST',
      //     data: formData,
      //     processData: false,
      //     contentType: false,
      //     success: function(response) {
      //         // Add the new avatar to the UI
      //         addAvatarToUI(response);
      //         $('#addAvatarModal').modal('hide');
      //     },
      //     error: function(error) {
      //         // Handle error
      //         console.error('Error adding avatar:', error);
      //     }
      // });

      // For now, let's just log and hide the modal
      console.log('Adding avatar:', formData);
      $('#addAvatarModal').modal('hide');
    });

    // When the delete button is clicked, show the confirmation modal
    $('.delete-avatar').on('click', function () {
      avatarToDelete = $(this).data('id');
      $('#deleteAvatarModal').modal('show');
    });

    $('#avatar-search').on('input', function () {
      // Handle search/filtering
      console.log('Searching for ' + $(this).val());
    });
    console.log('Avatar Gallery loaded admin panel script initialized!');
  };

  $('.rename-avatar').on('click', function () {
    var avatarId = $(this).data('id');
    var currentName = $(this).closest('.card').find('.card-title').text();
    $('#rename-avatar-id').val(avatarId);
    $('#new-avatar-name').val(currentName);
    $('#renameAvatarModal').modal('show');
  });

  $('#submit-rename-avatar').on('click', function () {
    var avatarId = $('#rename-avatar-id').val();
    var newName = $('#new-avatar-name').val();

    // Add your AJAX call here to submit the new name to your backend
    // On success, update the avatar name in the UI and close the modal
    // Example:
    // $.post('/api/admin/plugins/avatargallery/rename', { id: avatarId, name: newName })
    //     .done(function(response) {
    //         // Update UI
    //         $('[data-id="' + avatarId + '"]').closest('.card').find('.card-title').text(newName);
    //         $('#renameAvatarModal').modal('hide');
    //     })
    //     .fail(function(error) {
    //         // Handle error
    //     });
  });

  // When the delete is confirmed in the modal
  $('#confirm-delete-avatar').on('click', function () {
    if (avatarToDelete) {
      // Add your AJAX call here to delete the avatar
      // Example:
      // $.ajax({
      //     url: '/api/admin/plugins/avatargallery/delete',
      //     type: 'DELETE',
      //     data: { id: avatarToDelete },
      //     success: function(response) {
      //         // Remove the avatar from the UI
      //         $('[data-id="' + avatarToDelete + '"]').closest('.col-md-3').remove();
      //         $('#deleteAvatarModal').modal('hide');
      //     },
      //     error: function(error) {
      //         // Handle error
      //         console.error('Error deleting avatar:', error);
      //     }
      // });

      // For now, let's just log and hide the modal
      console.log('Deleting avatar with ID:', avatarToDelete);
      $('#deleteAvatarModal').modal('hide');
    }
  });

  return AvatarGallery;
});
