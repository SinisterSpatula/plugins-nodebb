'use strict';

define('forum/your-plugin-name', ['api', 'alerts'], function (api, alerts) {
  $(window).on('action:ajaxify.end', function (event, data) {
    if (data.url.startsWith('user/') || data.url.startsWith('account/')) {
      handleProfilePage();
    }
  });

  function handleProfilePage() {
    const userId = ajaxify.data.uid;

    api
      .get(`/users/${userId}`, {})
      .then((userData) => {
        console.log('User data:', userData);

        const customElement = $('<div class="custom-profile-info"></div>');
        customElement.text(`Last seen: ${new Date(userData.lastonline).toLocaleString()}`);
        $('.account-stats').append(customElement);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }
});
