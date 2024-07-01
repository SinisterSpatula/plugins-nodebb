'use strict';

const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res) {
  /*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/
  res.render('admin/plugins/avatargallery', {
    title: 'Avatar Gallery',
    avatars: [
      {
        id: 1,
        name: 'Smiling Sunflower',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'users',
      },
      {
        id: 2,
        name: 'Cosmic Nebula',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'moderators',
      },
      {
        id: 3,
        name: 'Majestic Unicorn',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'global_moderators',
      },
      {
        id: 4,
        name: 'Serene Waterfall',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'users',
      },
      {
        id: 5,
        name: 'Enchanted Forest',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'moderators',
      },
      {
        id: 6,
        name: 'Mystical Dragon',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'global_moderators',
      },
      {
        id: 7,
        name: 'Shimmering Aurora',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'users',
      },
      {
        id: 8,
        name: 'Tranquil Beach',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'moderators',
      },
      {
        id: 9,
        name: 'Majestic Mountain',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'global_moderators',
      },
      {
        id: 10,
        name: 'Whimsical Butterfly',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
        accessLevel: 'users',
      },
    ],
  });
};
