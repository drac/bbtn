// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Google Analytics: change UA-XXXXX-X to be your site's ID.
var _gaq=[['_setAccount','UA-43028771-1'],['_trackPageview']];
(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
g.src='//www.google-analytics.com/ga.js';
s.parentNode.insertBefore(g,s)}(document,'script'));




/**
 * Google Analytics download click event tracking
 * 20130419
 *
 * Use Google Analytics to track clicks as events on the following link types:
 * File (PDFs, MP3s, EXEs, etc.).
 *
 * For more information about Google Analytics link tracking, see:
 * https://support.google.com/analytics/answer/1136922
 *
 * Based on code from Blast Analytics & Marketing
 * "How to Track Downloads & Outbound Links in Google Analytics"
 * http://bit.ly/11K1Rcm
 *
 * Copyright 2013 Jeffrey Barke
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */
/*jslint browser: true, nomen: true, white: true */
/*global _gaq, jQuery */

// Make sure there is a Google Analytics and a jQuery, otherwise not much point.
if (!(window._gaq === undefined || window.jQuery === undefined)) {
	// Wrap in anonymous function to safely alias jQuery.
	(function ($) {
		'use strict';
		// Document ready.
		$(function () {

			var fileTypes = '\\.(' +
					'dmg|exe|' +
					'rar|zip|' +
					'pdf|txt|' +
					'mp3|' +
					'avi|flv|mov|wav|wma|wmv|' +
					'docx?|xlsx?|pptx?' +
					')$',

				regExes = {
					download: new RegExp(fileTypes, 'i'),
					external: /^https?\:\/\//i,
					hostName: new RegExp(location.host, 'i')
				},

				baseHref = $('base').attr('href') || '',

				// Helper functions

				isDownload = function (url) {
					return regExes.download.test(url);
				},

				isExternal = function (url, rel) {
					// External links have either been marked rel=external
					// or must begin with https? 
					// and must not include current host name.
					return ((rel || '').indexOf('external') !== -1) ||
							(regExes.external.test(url) &&
							!regExes.hostName.test(url));
				},

				getFileName = function (url) {
					var parts = url.split('/');
					return parts[parts.length - 1];
				},

				getFileExt = function (fileName) {
					return fileName.match(regExes.download)[1].toUpperCase();
				},

				setData = function (loc, category, action, label) {
					loc = loc || '';
					category = category || 'Link clicks';
					action = action || '';
					label = label || '';
					return {
						category: category,
						action: action,
						label: label,
						loc: loc
					};
				};

			$('body').on('click', 'a', function () {
				var $el = $(this),
					url = $el.attr('href') || '',
					rel = $el.attr('rel') || '',
					target = ($el.attr('target') || '').toLowerCase(),
					fileName,
					data;
				// Non-external download link
				if (!isExternal(url, rel) && isDownload(url)) {
					fileName = getFileName(url);
					data = setData(baseHref + url, 'Downloads',
							getFileExt(fileName) + ' download', fileName);
				// Internal link. Don't track.
				} else {
					return;
				}
				// Track it.
				_gaq.push(['_trackEvent', data.category, data.action,
						data.label]);
				// If link doesn't open in new window, give GA time to
				// track it.
				if ('_blank' !== target) {
					setTimeout(function () {
						location.href = data.loc;
					}, 400);
					return false;
				}
			});

		});
	}(jQuery));
}
