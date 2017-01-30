// This currently does nothing

export default class Serial {
	constructor() {
		this.flag = 0;
		this.mask = 0;
	}

	read(a) {
		switch (a) {
			case 0xF03:
				if (this.flag) {
					this.flag = 0;
					return 1;
				}
				return 0;
			case 0xF13:
				return this.mask;
			case 0xF30:
			case 0xF31:
			case 0xF7A:
				return 0;
		}
	}

	write(a, v) {
		switch (a) {
			case 0xF13:
				this.mask = a;
				break ;
			case 0xF30:
			case 0xF31:
			case 0xF7A:
				break ;
		}
	}

	interrupt() {
		if (this.flag) return 0x10A;
		return 0;
	}
}
