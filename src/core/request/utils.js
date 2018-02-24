/**
 * BY-Health Front-end Team (https://www.by-health.com/)
 *
 * Copyright © 2016-2017 By-Health Co Ltd. All rights reserved.
 */
/* eslint-disable import/prefer-default-export */

export function isAbsoluteUrl(url) {
	return /^[a-z][a-z0-9+.-]*:/.test(url);
}
