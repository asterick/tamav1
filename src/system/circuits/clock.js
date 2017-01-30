const CLOCK_SPEED = 8192;	// This is actually 4% faster, but it makes timers easier
const PERF_CLOCK = 256;

const TIMER_DIVIDER_CYCLES = CLOCK_SPEED / PERF_CLOCK;
const TIMER_DIVIDER = Math.round(Math.log(TIMER_DIVIDER_CYCLES) / Math.log(2));
const DIVIDER_MASK = TIMER_DIVIDER_CYCLES - 1;
const WATCHDOG_TIME = 3*262144; // 3 Seconds

const STOPWATCH_TRANSLATE = new Uint8Array(0x100);

var i = 0;
for (var h = 0; h < 10; h++) {
	for (var l = 0; l < 10; l++) {
		var repeat = (l & 1) && ((h & 2) || (l != 1)) ? 2 : 3;
		while (repeat--) STOPWATCH_TRANSLATE[i++] = (h << 4) | l;
	}
}

export default class Clock {
	constructor() {
		this.divider = 0;

		this.watchdog = 0;
		
		this.clock = 0;
		this.clock_mask = 0;
		this.clock_interrupt = 0;

		this.stopwatch = 0;
		this.stopwatch_run = false;
		this.stopwatch_mask = 0;
		this.stopwatch_interrupt = 0;
	}

	interrupt() {
		if (this.stopwatch_interrupt & this.stopwatch_mask) return 0x104;
		if (this.clock_interrupt & this.clock_mask) return 0x102;
		return 0;
	}

	read(a) {
		var temp;
		switch (a) {
		case 0xF00:
			temp = this.clock_interrupt;
			this.clock_interrupt = 0;
			return temp;
		case 0xF01:
			temp = this.stopwatch_interrupt;
			this.stopwatch_interrupt = 0;
			return temp;
		case 0xF10:
			return this.clock_mask;
		case 0xF10:
			return this.stopwatch_mask;
		case 0xF20:
			return this.clock & 0xF;
		case 0xF21:
			return (this.clock >> 4) & 0xF;
		case 0xF22:
			return STOPWATCH_TRANSLATE[this.stopwatch] & 0xF;			
		case 0xF23:
			return STOPWATCH_TRANSLATE[this.stopwatch] >> 4;
		case 0xF76: case 0xF77:
			return 0;
		}
	}

	write(a, v) {
		switch (a) {
		case 0xF10:
			this.clock_mask = v;
			break ;
		case 0xF11:
			this.stopwatch_mask = v & 3;
			break ;
		case 0xF76:
			if (v & 2) this.clock = 0;
			if (v & 1) this.watchdog = 0;
			break ;
		case 0xF77:
			if (v & 2) this.stopwatch = 0;
			this.stopwatch_run = v & 1;
			break ;
		default:
			console.error("CLOCK WRITE", a.toString(16), v.toString(16));
		}
	}

	step(ticks) {
		this.divider += ticks;
		if (this.divider < TIMER_DIVIDER_CYCLES) {
			return ;
		}
		var delta = this.divider >> TIMER_DIVIDER;
		this.divider &= DIVIDER_MASK;

		// Watchdog (3 seconds)
		if (this.watchdog += delta > WATCHDOG_TIME) {
			throw new Error("System watchdog");
		}

		// Clock
		{
			this.clock_interrupt |= (this.clock & ~(++this.clock)) >> 4;
			this.clock &= 0xFF;
		}

		// Stopwatch
		if (this.stopwatch_run) {
			var falling = this.stopwatch & ~(++this.stopwatch);
			this.stopwatch &= 0xFF;

			if (falling & 0xF8) this.stopwatch_interrupt |= 1;
			if (falling & 0x80) this.stopwatch_interrupt |= 2;
		}
	}
}
