/* eslint-disable import/prefer-default-export */

export function setRuntimeVariable({ name, value }) {
	return {
		type: 'SET_RUNTIME_VARIABLE',
		payload: {
			name,
			value
		}
	};
}
