const CLOCK_SPEED = 8192;
const CLOCK_RATES = [0, 0, 256, 512, 1024, 2048, 4096, 8192];
const CLOCK_SHIFT = CLOCK_RATES.map((v) => Math.round(Math.log(CLOCK_SPEED / v) / Math.log(2)));

export default class Timer {
	constructor() {
		this.divider = 0;
		this.running = false;
		this.count = 0;
		this.reload = 0;
		this.trigger = false;
		this.mask = false;
		
		this.config = 0x7;

		this.timed = true;				
		this.clock_shift = CLOCK_SHIFT[7];
	}

	interrupt() {
		if (this.trigger & this.mask) return 0x10C;
		return 0;
	}

	read(a) {
		switch (a) {
			case 0xF02:
				if (this.trigger) {
					this.trigger = false;
					return 1;		
				}
				return 0;
			case 0xF12: 
				return this.mask ? 1 : 0;
			case 0xF24: 
				return this.count & 0xF;
			case 0xF25: 
				return this.count >> 4;
			case 0xF26:
				return this.reload & 0xF;
			case 0xF27: 
				return this.reload >> 4;
			case 0xF78: 
				return this.running ? 1 : 0;
			case 0xF79:
				return this.config;
		}
	}

	write(a, v) {
		switch (a) {
			case 0xF12: 
				this.mask = v & 1;
				break ;
			case 0xF26:
				this.reload = (this.reload & 0xF0) | v;
				break ;
			case 0xF27: 
				this.reload = (this.reload & 0x0F) | (v << 4);
				break ;
			case 0xF78: 
				if (v & 2) this.count = this.reload;
				this.running = v & 1;
				break ;
			case 0xF79:
				this.config = v;

				switch (v & 7) {
				case 0: // K03 filtered
					throw new Error("Cannot handle K03 triggered timers");
					break ;
				case 1: // K03 direct
					throw new Error("Cannot handle K03 triggered timers");
					break ;
				default: // Clocked
					this.timed = true;				
					this.clock_shift = CLOCK_SHIFT[v & 7];
					this.clock_mask = (1 << this.clock_shift) - 1;
				}

				break ;
		}
	}

	step(ticks) {
		var before = this.divider;
		this.divider += ticks;

		// This isn't accurate if the divider gets longer
		var delta = this.divider >> this.clock_shift;
		this.divider &= this.clock_mask;

		if (!this.running || !this.timed || !delta) {
			return ;
		}

		while (delta-- > 0) {
			this.count = (this.count - 1) & 0xFF;

			if (this.count == 0) {
				this.count = this.reload * 2;
				this.trigger = true;
			}
		}
	}
}

