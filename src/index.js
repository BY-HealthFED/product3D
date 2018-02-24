// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';

import { createStore } from 'redux';
import { Provider } from 'preact-redux';
import reducer from '~/reducers/user';

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	window.alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' +  errorObj);
};

let root;
const store = createStore(reducer);
function init() {
	let App = require('./components/app').default;
	root = render(<Provider store={store}><App /></Provider>, document.body, root);
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV==='production') {
	require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
