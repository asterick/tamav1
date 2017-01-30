import styles from './index.scss';
import React from 'react';

function hex(v, l) {
	var h = v.toString(16);
	return "0000".substr(4 - (l - h.length)) + h;
}

const MEMORY_PER_LINE = 0x20;
const MEMORY_TOTAL = 0x280;

export default class Debugger extends React.Component {
	memory(start, end) {
		const runtime = this.props.runtime;
		const lines = [];

		for (var o = start; o < end; o += MEMORY_PER_LINE) {
			var line = [];

			for (var b = 0; b < Math.min(MEMORY_PER_LINE, end - o); b++) {
				line.push(<span key={b}>{runtime.ram[o+b].toString(16)}</span>);
			}

			lines.push(<div key={o}><span>{hex(o, 4)}: </span>{ line }</div>);
		}
		
		return <div>{lines}</div>;
	}

	render() {
		var runtime = this.props.runtime;

		return <div className={styles.debugger}>
			<div>
				<span> PC: { hex(runtime.pc, 4) }</span>
				<span> SP: { hex(runtime.sp, 2) }</span>
				<span> I <input type="checkbox" checked={runtime.i} /></span>
				<span> D <input type="checkbox" checked={runtime.d} /></span>
				<span> Z <input type="checkbox" checked={runtime.z} /></span>
				<span> C <input type="checkbox" checked={runtime.c} /></span>
			</div>
			<div>
				<span> A: { runtime.a.toString(16) }</span>
				<span> B: { runtime.b.toString(16) }</span>
				<span> X: { hex(runtime.x, 3) }</span>
				<span> Y: { hex(runtime.y, 3) }</span>
			</div>
			{ this.memory(0, MEMORY_TOTAL) }
		</div>
	}
}
