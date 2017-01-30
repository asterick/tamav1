const LINE_TABLE = [
	 2,  4,  6,  8, 10, 12, 14, 18, 
	20, 22, 24, 26, 28, 30, 32, 72, 
	70, 68, 66, 64, 62, 60, 58, 54, 
	52, 50, 48, 46, 44, 42, 40, 38,

	// This are the apparent unused lines
	//0,  16, 34, 36, 56, 74, 76, 78
];

const WIDTH = LINE_TABLE.length;

const PALETTE = [
	0xffcccccc, 0xffcccccc, 0xffcccccc, 0xffcccccc,
	0xffcccccc, 0xffcccccc, 0xffcccccc, 0xffcccccc,
	0xffb5b5b5, 0xff9e9e9e, 0xff888888, 0xff717171, 
	0xff5a5a5a, 0xff444444, 0xff2d2d2d, 0xff161616,
	0xff000000, 0xff000000, 0xff000000, 0xff000000, 
	0xff000000, 0xff000000, 0xff000000, 0xff000000, 
];

export default class Video {
	constructor(ram) {
		this.config = 0x8;
		this.ram = ram;
		this.contrast = 0;
	}

	get icons() {
		return this.ram[16] | (this.ram[56+0x81] << 4);
	}

	paint(pixels) {
		//if (!this.repaint) return false;
		this.repaint = false;

		const on = PALETTE[this.contrast + 8];
		const off = PALETTE[this.contrast];

		// All off / on
		if (this.config & 0xC) {
			for (var i = 0; i < pixels.length; i++) {
				pixels[i] = this.config & 0x8 ? off : on;
			}
			return ;
		}

		for (var i = 0; i < LINE_TABLE.length; i++) {
			var o = LINE_TABLE[i] || i;
			const line =
				this.ram[o] |
				(this.ram[o+1]<<4) |
				(this.ram[o+0x80]<<8) |
				(this.ram[o+0x81]<<12);

			for (var b = 0; b < 16; b++) {
				var k = ((line >> b) & 1) ? on : off;
				if(i+b&1) k &= 0xFFE0E0E0;

				pixels[b * WIDTH + i] =  k;
			}
		}

		return true;
	}

	read(a) {
		switch (a) {
			case 0xF71:
				return this.config;
			case 0xF72:
				return this.contrast;
		}
	}

	write(a, v) {
		switch (a) {
			case 0xF71:
				this.config = v;
				break ;
			case 0xF72:
				this.contrast = v;
				break ;
		}
	}
}

Video.prototype.WIDTH = LINE_TABLE.length;
