import { render } from 'inferno';

import App from './ui';

function rerender() {
	const App = require('./ui').default;
	return render(<App/>, document.querySelector("#app"));
}

rerender();
