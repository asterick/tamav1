var pressed = 0;

window.addEventListener("keydown", (e) => {
	switch (e.keyCode) {
	case 65:
		pressed |= 4;
		break ;
	case 83:
		pressed |= 2;
		break ;
	case 68:
		pressed |= 1;
		break ;
	}
});

window.addEventListener("keyup", (e) => {
	switch (e.keyCode) {
	case 65:
		pressed &= ~4;
		break ;
	case 83:
		pressed &= ~2;
		break ;
	case 68:
		pressed &= ~1;
		break ;
	}
});

export default class Inputs {
	constructor() {
		this.k0_flag = false;
		this.k1_flag = false;
		this.k0_mask = 0;
		this.k1_mask = 0;
		this.k0_relation = 0xF;
	}

	interrupt() {
		if (this.k1_flag) return 0x108;
		if (this.k0_flag) return 0x106;
		return 0;
	}

	read(a) {
		switch (a) {
		case 0xF04:
			if (this.k0_flag) {
				this.k0_flag = false;
				return 1;
			}
			return 0;
		case 0xF05:
			if (this.k1_flag) {
				this.k1_flag = false;
				return 1;
			}
			return 0;
		case 0xF14:
			return this.k0_mask;
		case 0xF14:
			return this.k1_mask;
		case 0xF40: // THIS IS ALL LAME BOILERPLATE
			return ~pressed;
		case 0xF41:
			return this.k0_relation;
		case 0xF42:
			return 0xF;
		}
	}

	write(a, v) {
		switch (a) {
		case 0xF14:
			this.k0_mask = v;
			break ;
		case 0xF14:
			this.k1_mask = v;
			break ;
		case 0xF41:
			this.k0_relation = v;
			break ;
		}
	}
}
