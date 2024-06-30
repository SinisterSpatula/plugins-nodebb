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
        name: 'Avatar 1',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
      },
      {
        id: 2,
        name: 'Avatar 2',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
      },
      {
        id: 3,
        name: 'Avatar 3',
        path: '/assets/uploads/profile/uid-1/1-profileavatar-1719727087917.jpeg?1719727087926',
      },
    ],
  });
};
