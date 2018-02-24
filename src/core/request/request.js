/**
 * BY-Health Front-end Team (https://www.by-health.com/)
 *
 * Copyright © 2016-2017 By-Health Co Ltd. All rights reserved.
 */
/* eslint-disable class-methods-use-this */

import 'whatwg-fetch';
import extend from 'extend';
import { stringify } from 'query-string';
import compose from './compose';
import { isAbsoluteUrl } from './utils';

/**
 * Enhanced Fetch Api
 */
class Request {
	static defaults = {
		baseUrl: '',
		method: 'GET',
		headers: {},
		params: {}
	}

	constructor(options, middlewares) {
		this.options = extend(true, {}, Request.defaults, options);
		this.middlewares = [...middlewares].reverse();
	}

	use(fn) {
		if (typeof fn !== 'function') {
			throw new TypeError('Middleware must be a function!');
		}

		this.middlewares.unshift(fn);
	}

	createContext(url, options) {
		const context = { url };
		extend(true, context, this.options, options);
		return context;
	}

	applyFetch({ url, params, baseUrl, ...options }) {
		if (typeof url !== 'string') {
			throw new TypeError(`Parameter 'url' must be a string, not ${typeof url}`);
		}

    const _baseUrl = isAbsoluteUrl(url) ? '' : baseUrl; // eslint-disable-line
		const queryString = stringify(params);
		const concatSymbol = url.indexOf('?') > -1 ? '&' : '?';

		return fetch(`${_baseUrl}${url}${queryString && (concatSymbol + queryString)}`, options);
	}

	fetch(url, options) {
		const fn = compose(this.middlewares);
		const context = this.createContext(url, options);
		return fn(context, this.applyFetch);
	}

	head(url, options) {
		return this.fetch(url, { ...options, method: 'HEAD' });
	}

	options(url, options) {
		return this.fetch(url, { ...options, method: 'OPTIONS' });
	}

	get(url, options) {
		return this.fetch(url, { ...options, method: 'GET' });
	}

	delete(url, options) {
		return this.fetch(url, { ...options, method: 'DELETE' });
	}

	post(url, payload, options) {
		return this.fetch(url, { ...options, method: 'POST', body: payload });
	}

	put(url, payload, options) {
		return this.fetch(url, { ...options, method: 'PUT', body: payload });
	}
}

export default Request;
