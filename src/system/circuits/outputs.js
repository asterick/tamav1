const OUTPUT_FREQ = [ 4096, 3276, 2730, 2340, 2048, 1638, 1365, 1170 ];
var audioCtx = new AudioContext();

// THIS IS INCOMPLETE

class WaveGenerator {
	constructor() {
		this.oscillator = audioCtx.createOscillator();
		this.gainNode = audioCtx.createGain();

		this.oscillator.type = 'triangle';
		this.oscillator.frequency.value = 2048.0;
		this.oscillator.start();

		this.gainNode.gain.value = 0;

		this.oscillator.connect(this.gainNode);
		this.gainNode.connect(audioCtx.destination);
	}

	enable(v) {
		this.gainNode.gain.setValueAtTime(v ? 0.005 : 0, audioCtx.currentTime);
	}

	frequency(v) {
		this.oscillator.frequency.value = OUTPUT_FREQ[v];
	}
}

export default class Outputs {
	constructor() {
		this.wave = new WaveGenerator();

		this.config = 0xF;
		this.sound_timing = 0;
		this.envelope = 0;
	}

	interrupt() {
		return 0;
	}

	read(a) {
		switch (a) {
		case 0xF54:
			return this.config;
		case 0xF74:
			return this.sound_timing;
		case 0xF75:
			return this.envelope;
		default:
			console.error("UNHANDLED READ", a.toString(16))
			return 0;
		}
	}

	write(a, v) {
		switch (a) {
		case 0xF54:
			this.wave.enable(~v & 8);
			this.config = v;
			console.
			break ;
		case 0xF74:
			this.wave.frequency(v & 7);
			this.sound_timing = v;
			break ;
		case 0xF75:
			this.envelope = v & 0x3;
			break ;
		default:
			console.error("UNHANDLED WRITE", a.toString(16), v.toString(16))
		}
	}
}
