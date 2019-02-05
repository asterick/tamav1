import Program from "./program";

import Clock from "./circuits/clock";
import Timer from "./circuits/timer";
import Outputs from "./circuits/outputs";
import Inputs from "./circuits/inputs";
import Serial from "./circuits/serial";
import Video from "./circuits/video";

const GLOBAL_CLOCK_TARGET	= (2000000 / 128 * 32768)
const FAST_CLOCK_SPEED 		= (GLOBAL_CLOCK_TARGET / 2000000);
const MED_CLOCK_SPEED 		= (GLOBAL_CLOCK_TARGET / 1000000);
const OSC1_CLOCK_SPEED 		= (GLOBAL_CLOCK_TARGET / 32768 / 4);
const PERF_CLOCK_SPEED 		= (GLOBAL_CLOCK_TARGET / 8192);

export default class System {
	constructor() {
		this.clock_speed = OSC1_CLOCK_SPEED;
		this.perf_divider = 0;
		this.time = 0;
		this.divider = 0;
		
		// System control registers
		this.svd = 0;
		this.occ = 0;

		// Registers
		this.a = 0;
		this.b = 0;
		this.x = 0;
		this.y = 0;
		this.sp = 0;
		this.pc = 0x100;

		this.i = 0;
		this.d = 0;
		this.z = 0;
		this.c = 0;

		// Perfs
		this.ram = new Uint8Array(0x1000);
		this.clock = new Clock();
		this.timer = new Timer();
		this.inputs = new Inputs();
		this.outputs = new Outputs();
		this.serial = new Serial();
		this.video = new Video(this.ram);
	}

	run(clock) {
		this.time += GLOBAL_CLOCK_TARGET * clock / 1000;

		while (this.time > 0) {
			this.step();
		}
	}

	step() {
		var delta = 0;

		if (this.i) {
			var interrupt = 
				this.timer.interrupt() ||
				this.serial.interrupt() ||
				this.inputs.interrupt() ||
				this.clock.interrupt();

			if (interrupt) {
				this.push((this.pc >> 8) & 0xF);
				this.push((this.pc >> 4) & 0xF);
				this.push(this.pc & 0xF);
				this.pc = interrupt | (this.pc & ~0xFFF);
				this.i = false;
			}

			delta += 12;
		}

		if (this[this.pc] === undefined) {
			System.prototype[this.pc] = Program(this.pc);
		}

		delta += this[this.pc]() * this.clock_speed;
		
		this.time -= delta;
		this.perf_divider += delta;

		if (this.perf_divider >= PERF_CLOCK_SPEED) {
			const ticks = Math.floor(this.perf_divider / PERF_CLOCK_SPEED);
			this.perf_divider %= PERF_CLOCK_SPEED;

			this.timer.step(ticks);
			this.clock.step(ticks);
		}
	}

	// Memory functions
	write(a, v) {
		switch (a) {
			// Oscillation control circuit
			case 0xF70:
				switch (v) {
				case 0b0000:
				case 0b0001:
				case 0b0010:
				case 0b0011:
				case 0b0100:
				case 0b0101:
				case 0b0110:
				case 0b0111:
				case 0b1100:
					this.clock_speed = OSC1_CLOCK_SPEED;
					break ;
				case 0b1000:
				case 0b1001:
				case 0b1010:
				case 0b1011:
					throw new Error("CPU switched to an illegal clock mode");
				case 0b1101:					
					this.clock_speed = MED_CLOCK_SPEED;
					break ;
				case 0b1110:
				case 0b1111:
					this.clock_speed = FAST_CLOCK_SPEED;
					break ;
				}

				this.occ = v;
				break ;
			// Supply voltage detect
			case 0xF73:
				this.svd = v & 7;
				break ;
			// Video circuit
			case 0xF71: case 0xF72:
				this.video.write(a, v);
				break ;
			// Serial circuit
			case 0xF03: case 0xF13: case 0xF30: case 0xF31: case 0xF7A:
				this.serial.write(a, v);
				break ;
			// Inputs circuit
			case 0xF04: case 0xF05: case 0xF14: case 0xF15: case 0xF40: 
			case 0xF41: case 0xF42:
				this.inputs.write(a, v);
				break ;
			// Sound circuit (fall-through to outputs)
			case 0xF54: case 0xF74: case 0xF75: 
			// Outputs circuit
			case 0xF50: case 0xF51: case 0xF52: case 0xF53: case 0xF54:
			case 0xF7B:
				this.outputs.write(a, v);
				break ;
			// Timer circuit
			case 0xF02: case 0xF12: case 0xF24: case 0xF25: case 0xF26:
			case 0xF27: case 0xF78: case 0xF79:
				this.timer.write(a, v);
				break ;
			// Clock circuits
			case 0xF00: case 0xF10: case 0xF20: case 0xF21: case 0xF76:
			case 0xF01: case 0xF11: case 0xF22: case 0xF23: case 0xF77:
				this.clock.write(a, v);
				break ;
			case 0xE00:
				this.video.repaint = true;
			default:
				if ((a & 0xF00) == 0xF00) console.error(a.toString(16), v.toString(16));
				this.ram[a] = v;
				break ;
		}
	}

	read(a) {
		switch (a) {
			// Oscillation control circuit
			case 0xF70:
				return this.occ;
			// Supply voltage detect
			case 0xF73:
				return this.svd;
			// Video circuit
			case 0xF71: case 0xF72:
				return this.video.read(a);
			// Serial circuit
			case 0xF03: case 0xF13: case 0xF30: case 0xF31: case 0xF7A:
				return this.serial.read(a);
			// Inputs circuit
			case 0xF04: case 0xF05: case 0xF14: case 0xF15: case 0xF40: 
			case 0xF41: case 0xF42:
				return this.inputs.read(a);
			// Sound circuit (fall-through to outputs)
			case 0xF54: case 0xF74: case 0xF75: 
			// Outputs circuit
			case 0xF50: case 0xF51: case 0xF52: case 0xF53: case 0xF54:
			case 0xF7B:
				return this.outputs.read(a);
			// Timer circuit
			case 0xF02: case 0xF12: case 0xF24: case 0xF25: case 0xF26:
			case 0xF27: case 0xF28: case 0xF29:
				return this.timer.read(a);
			// Clock circuits
			case 0xF00: case 0xF10: case 0xF20: case 0xF21: case 0xF76:
			case 0xF01: case 0xF11: case 0xF22: case 0xF23: case 0xF77:
				return this.clock.read(a);
			default:
				if ((a & 0xF00) == 0xF00) console.error(a.toString(16));
				return this.ram[a];
		}
	}

	// Stack helpers
	push(v) {
		this.sp = (this.sp - 1) & 0xFF;
		this.ram[this.sp] = v;
	}

	pop() {
		var v = this.ram[this.sp];
		this.sp = (this.sp + 1) & 0xFF;
		return v;
	}

	// ==== Convenience accessors ====
	// Flags
	get f() {
		return  (this.i ? 8 : 0) |
				(this.d ? 4 : 0) |
				(this.z ? 2 : 0) |
				(this.c ? 1 : 0);
	}

	set f(v) {
		this.i = v & 8;
		this.d = v & 4;
		this.z = v & 2;
		this.c = v & 1;
	}
}
