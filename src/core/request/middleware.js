/**
 * BY-Health Front-end Team (https://www.by-health.com/)
 *
 * Copyright © 2016-2017 By-Health Co Ltd. All rights reserved.
 */

import { stringify } from 'query-string';
import TimeoutError from './timeoutError';

export function postForm(ctx, next) {
	if (ctx.method === 'POST') {
		switch (ctx.type) {
			case 'form':
				ctx.body = stringify(ctx.body);
				ctx.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
				break;
			case 'json':
				ctx.body = JSON.stringify(ctx.body);
				ctx.headers['Content-Type'] = 'application/json;charset=utf-8';
				break;
			default:
				break;
		}
	}

	return next();
}

export async function jsonResult(ctx, next) {
	const result = await next();
	const json = await result.json();

	// if (json.status !== '0') {
	// 	return Promise.reject(json);
	// }

	return json;
}

export async function timeout(ctx, next) {
	if (typeof ctx.timeout === 'number') {
		if (ctx.timeout > 0 && ctx.timeout !== Infinity) {
			const waitTime = ctx.timeout;
			return Promise.race([
				next(),
				new Promise((resolve, reject) =>
					setTimeout(() => reject(new TimeoutError()), waitTime)
				)
			]);
		}
		delete ctx.timeout;
	}

	return next();
}
