import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './ui';

function rerender() {
	const App = require('./ui').default;
	return render(<AppContainer>
		<App/>
	</AppContainer>, document.querySelector("#app"));
}

rerender();

if (module && module.hot) {
  module.hot.accept('./ui/index.jsx', () => {
    const App = require('./ui').default;
    rerender();
  });
}
