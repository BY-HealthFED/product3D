const defaultState = {
};
const reducer = (state = defaultState, action) => {
	const data = {};
	switch (action.type) {
		case 'SET_RUNTIME_VARIABLE':
			data[action.payload.name] = action.payload.value;
			console.log('??', data);
			return { ...state, ...data };
		default:
			return state;
	}
};

export default reducer;
