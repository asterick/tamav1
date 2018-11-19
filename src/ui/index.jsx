import { Component } from 'inferno';

import styles from './index.css';
import System from '../system';

import Tamagotchi from "./tamagotchi";
import Debugger from "./debugger";

const system = new System();

export default class App extends Component {
	// --- Life-cycle operations ---
	constructor(props, context) {
		super(props, context);
	}

	// --- Rendering ---
	render() {
		return <div>
			<Tamagotchi runtime={system} />
			<Debugger runtime={system} />
		</div>
	}
}
