import styles from './index.scss';
import React from 'react';
import System from '../system';

import Tamagotchi from "./tamagotchi";

function hex(v, l) {
	var h = v.toString(16);
	return "0000".substr(4 - (l - h.length)) + h;
}

export default class App extends React.Component {
	// --- Life-cycle operations ---
	constructor(props, context) {
		super(props, context);
	}

	// --- Rendering ---
	render() {
		return <div>
			<Tamagotchi />
		</div>;
	}
}
