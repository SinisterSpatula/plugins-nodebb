'use strict';

define('admin/plugins/avatargallery', ['api'], function (api) {
  var AvatarGallery = {};

  AvatarGallery.init = function () {
    $('#submit-avatar').on('click', function () {
      // Handle form submission
      console.log('Submitting avatar');
    });

    $('.rename-avatar').on('click', function () {
      var avatarId = $(this).data('id');
      // Handle renaming
      console.log('Renaming avatar ' + avatarId);
    });

    $('.delete-avatar').on('click', function () {
      var avatarId = $(this).data('id');
      // Handle deletion
      console.log('Deleting avatar ' + avatarId);
    });

    $('#avatar-search').on('input', function () {
      // Handle search/filtering
      console.log('Searching for ' + $(this).val());
    });
    console.log('Avatar Gallery loaded admin panel script initialized!');
  };

  return AvatarGallery;
});
