
modulejs.define('ext/thumbnails', ['_', 'core/settings', 'core/event', 'core/server'], function (_, allsettings, event, server) {

	var settings = _.extend({
			enabled: false,
			img: ['bmp', 'gif', 'ico', 'image', 'jpg', 'png', 'tiff'],
			mov: ['video'],
			doc: ['pdf', 'ps'],
			delay: 1000
		}, allsettings.thumbnails),

		requestThumbSquare = function (type, href, callback) {

			server.request({action: 'getThumbHref', type: type, href: href, mode: 'square', width: 96, height: 96}, function (json) {

				callback(json && json.code === 0 ? json.absHref : null);
			});
		},

		requestThumbRational = function (type, href, callback) {

			server.request({action: 'getThumbHref', type: type, href: href, mode: 'rational', width: 96 * 2, height: 96}, function (json) {

				callback(json && json.code === 0 ? json.absHref : null);
			});
		},

		checkItem = function (item) {

			var type = null;

			if (_.indexOf(settings.img, item.type) >= 0) {
				type = 'img';
			} else if (_.indexOf(settings.mov, item.type) >= 0) {
				type = 'mov';
			} else if (_.indexOf(settings.doc, item.type) >= 0) {
				type = 'doc';
			}

			if (type) {
				if (item.thumbSquare) {
					item.$view.find('.icon.square img').addClass('thumb').attr('src', item.thumbSquare);
				} else {
					requestThumbSquare(type, item.absHref, function (src) {

						if (src && item.$view) {
							item.thumbSquare = src;
							item.$view.find('.icon.square img').addClass('thumb').attr('src', src);
						}
					});
				}
				if (item.thumbRational) {
					item.$view.find('.icon.rational img').addClass('thumb').attr('src', item.thumbRational);
				} else {
					requestThumbRational(type, item.absHref, function (src) {

						if (src && item.$view) {
							item.thumbRational = src;
							item.$view.find('.icon.rational img').addClass('thumb').attr('src', src);
						}
					});
				}
			}
		},

		onLocationChanged = function (item) {

			setTimeout(function () {

				_.each(item.content, checkItem);
			}, settings.delay);
		},

		onLocationRefreshed = function (item, added, removed) {

			_.each(added, checkItem);
		},

		init = function () {

			if (!settings.enabled || !server.api) {
				return;
			}

			event.sub('location.changed', onLocationChanged);
			event.sub('location.refreshed', onLocationRefreshed);
		};

	init();
});
