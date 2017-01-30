import styles from './index.scss';
import React from 'react';

import Debugger from './debugger';

import System from '../system';

var turbo = false;
window.addEventListener("keydown", (e) => {
	if (e.keyCode == 192) turbo = true;
})

window.addEventListener("keyup", (e) => {
	if (e.keyCode == 192) turbo = false;
})

export default class Tamagotchi extends React.Component {
	// --- Life-cycle operations ---
	constructor(props, context) {
		super(props, context);

		this.state = {
			runtime: new System(),
		};

		this.time = Date.now();
		this.pixels = new Uint32Array(this.width*16);
		this.image = new ImageData(new Uint8ClampedArray(this.pixels.buffer), this.width, 16);

		this.step();
	}

	get width() {
		return this.state.runtime.video.WIDTH;
	}

	repaint() {
		if (this.canvas && this.state.runtime.video.paint(this.pixels)) {
			this.canvas.putImageData(this.image, 0, 0);
		}
	}

	step() {
		var time = Date.now();
		var delta = Math.min(1000, time - this.time);

		this.state.runtime.run(delta * (turbo ? 600 : 1));
		this.time = time;
		this.repaint();

		window.requestAnimationFrame(() => this.step());

		this.setState({})
	}

	// --- Rendering ---
	render() {
		return <div className={styles["emulator"]}>
			<div className={styles["display"]}>
				<canvas width={this.width} height={16} ref={(canvas) => this.canvas = canvas && canvas.getContext('2d')} />
				<div className={styles["icons"]}>
					<span className={styles["attention"]}>{ this.state.runtime.video.icons & 0x80 ? "🗣" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x01 ? "🍱" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x02 ? "💡" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x04 ? "🎮" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x08 ? "💊" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x10 ? "🛁" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x20 ? "📊" : null }</span>
					<span>{ this.state.runtime.video.icons & 0x40 ? "💀" : null }</span>
				</div>
			</div>
		</div>
	}
}
