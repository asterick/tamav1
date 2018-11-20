import ProgramRom from "../data/tama";
import Table from "./table";
import Disassemble from "./disasm";

const read_reg_table = ["this.a", "this.b", "this.read(this.x)", "this.read(this.y)"];

const read_translate = {
	"A": () => "this.a",
	"B": () => "this.b",
	"XL": () => "(this.x & 0xF)",
	"XH": () => "((this.x >> 4) & 0xF)",
	"XP": () => "((this.x >> 8) & 0xF)",
	"XB": () => "(this.x & 0xFF)",
	"YL": () => "(this.y & 0xF)",
	"YH": () => "((this.y >> 4) & 0xF)",
	"YP": () => "((this.y >> 8) & 0xF)",
	"YB": () => "(this.y & 0xFF)",
	"SPL": () => "(this.sp & 0xF)",
	"SPH": () => "(this.sp >> 4)",
	"F": () => "this.f",
	"MX": () => "this.read(this.x)",
	"MY": () => "this.read(this.y)",
	"{I}": (word) => word,
	"{I4}": (word) => word & 0xF,
	"{X}": (word) => read_reg_table[word & 0x3],
	"{Y}": (word) => read_reg_table[(word >> 2) & 0x3],
	"{Z}": (word) => read_reg_table[(word >> 4) & 0x3],
	"M{I}": (word) => `this.ram[${word}]`
};

const write_reg_table = [
	(v) => `this.a = ${v}`, 
	(v) => `this.b = ${v}`, 
	(v) => `this.write(this.x, ${v})`,
	(v) => `this.write(this.y, ${v})`,
];

const write_translate = {
	"A": () => (v) => `this.a = ${v}`,
	"B": () => (v) => `this.b = ${v}`,
	"XL": () => (v) => `this.x = (this.x & 0xFF0) | ${v}`,
	"XH": () => (v) => `this.x = (this.x & 0xF0F) | (${v} << 4)`,
	"XP": () => (v) => `this.x = (this.x & 0x0FF) | (${v} << 8)`,
	"XB": () => (v) => `this.x = (this.x & 0xF00) | ${v}`,
	"YL": () => (v) => `this.y = (this.y & 0xFF0) | ${v}`,
	"YH": () => (v) => `this.y = (this.y & 0xF0F) | (${v} << 4)`,
	"YP": () => (v) => `this.y = (this.y & 0x0FF) | (${v} << 8)`,
	"YB": () => (v) => `this.y = (this.y & 0xF00) | ${v}`,
	"SPL": () => (v) => `this.sp = (this.sp & 0xF0) | ${v}`,
	"SPH": () => (v) => `this.sp = (this.sp & 0x0F) | (${v} << 4)`,
	"F": () => (v) => `this.f = ${v}`,
	"MX": () => (v) => `this.write(this.x, ${v})`,
	"MY": () => (v) => `this.write(this.y, ${v})`,
	"{X}": (word) => write_reg_table[word & 0x3],
	"{Y}": (word) => write_reg_table[(word >> 2) & 0x3],
	"{Z}": (word) => write_reg_table[(word >> 4) & 0x3],
	"M{I}": (word) => (v) => `this.ram[${word}] = ${v}`,
	"fallback": () => () => { throw new Error("Cannot write back") }
};

const ADD = `
	if (this.d && temp > 9) temp += 6;
	this.c = temp >= 0x10;
	temp &= 0xF;
	this.z = !temp;
`;

const SUB = `
	if (this.d && temp < 0) temp -= 6;
	this.c = temp < 0;
	temp &= 0xF;
	this.z = !temp;
`;

const Templates = {
	"LD": (pc, time, pset, write, a, b) => `
	${write(b)};
	`,
	"LDPX": (pc, time, pset, write, a, b) => `
	${write(b)};
	this.x = (this.x + 1) & 0xFFF;
	`,
	"LDPY": (pc, time, pset, write, a, b) => `
	${write(b)};
	this.y = (this.y + 1) & 0xFFF;
	`,
	"LBPX": (pc, time, pset, write, a) => `
	this.write(this.x, ${a & 0xF}); 
	this.x = (this.x + 1) & 0xFFF; 
	this.write(this.x, ${a >> 4});
	this.x = (this.x + 1) & 0xFFF;
	`,

	"PUSH": (pc, time, pset, write, a) => `
	this.push(${a});
	`,
	"POP": (pc, time, pset, write, a) => `
	${write("this.pop()")};
	`,

	"AND": (pc, time, pset, write, a, b) => `
	temp = ${a} & ${b};
	this.z = !temp;
	${write("temp")};
	`,
	"OR": (pc, time, pset, write, a, b) => `
	temp = ${a} | ${b};
	this.z = !temp;
	${write("temp")};
	`,
	"XOR": (pc, time, pset, write, a, b) => `
	temp = ${a} ^ ${b};
	this.z = !temp;
	${write("temp")};
	`,
	"RRC": (pc, time, pset, write, a) => `
	temp = (this.c ? 0x10 : 0) | ${a}; 
	this.c = temp & 1; 
	temp >>= 1;
	this.z = !temp;
	${write("temp")};
	`,
	"FAN": (pc, time, pset, write, a, b) => `
	temp = ${a} & ${b};
	this.z = !temp;
	`,

	"INC": (pc, time, pset, write, a) => `
	temp = ${a} + 1;
	this.c = (temp >= 0x10);
	temp &= 0xF;
	this.z = !temp;
	${write("temp")};
	`,
	"DEC": (pc, time, pset, write, a) => `
	temp = ${a} - 1;
	this.c = (temp < 0);
	temp &= 0xF;
	this.z = !temp;
	${write("temp")};
	`,

	"ADD": (pc, time, pset, write, a, b) => `
	temp = ${a} + ${b};
	${ADD}
	${write("temp")}; 
	`,
	"ADC": (pc, time, pset, write, a, b) => `
	temp = ${a} + ${b} + (this.c ? 1 : 0);
	${ADD}
	${write("temp")};
	`,
	"ACPX": (pc, time, pset, write, a) => `
	temp = this.read(this.x) + ${a} + (this.c ? 1 : 0); 
	${ADD}
	this.write(this.x, temp); 
	this.x = (this.x + 1) & 0xFFF;
	`,
	"ACPY": (pc, time, pset, write, a) => `
	temp = this.read(this.y) + ${a} + (this.c ? 1 : 0);
	${ADD}
	this.write(this.y, temp);
	this.y = (this.y + 1) & 0xFFF;
	`,
	"ADC_D": (pc, time, pset, write, a, b) => `
	temp = ${a} + ${b} + (this.c ? 1 : 0)
	this.c = (temp >= 0x10);
	temp &= 0xF;
	this.z = !temp;
	${write("temp")};
	`,
	"SUB": (pc, time, pset, write, a, b) => `
	temp = ${a} - ${b};
	${SUB}
	${write("temp")};
	`,
	"SBC": (pc, time, pset, write, a, b) => `
	temp = ${a} - ${b} - (this.c ? 1 : 0);
	${SUB}
	${write("temp")};
	`,
	"SCPX": (pc, time, pset, write, a) => `
	temp = this.read(this.x) - ${a} - (this.c ? 1 : 0);
	${SUB}
	this.write(this.x, temp);
	this.x = (this.x + 1) & 0xFFF;
	`,
	"SCPY": (pc, time, pset, write, a) => `
	temp = this.read(this.y) - ${a} - (this.c ? 1 : 0);
	${SUB}
	this.write(this.y, temp);
	this.y = (this.y + 1) & 0xFFF;
	`,
	"CP":  (pc, time, pset, write, a, b) => `
	temp = ${a} - ${b};
	this.c = (temp < 0);
	this.z = (temp == 0);
	`,

	"JP": (pc, time, pset, write, a) => `
	this.pc = ${pset | a};
	return ${time};
	`,
	"JPBA": (pc, time, pset, write, a) => `
	this.pc = ${pset} | (this.b << 4) | this.a;
	return ${time};
	`,
	"CALL": (pc, time, pset, write, a) => `
	this.push(${(pc >> 8) & 0xF});
	this.push(${(pc >> 4) & 0xF});
	this.push(${pc & 0xF});
	this.pc = ${(pset & 0xF00) | a | ((pc - 1) & 0x1000)};
	return ${time};`,
	"CALZ": (pc, time, pset, write, a) => `
	this.push(${(pc >> 8) & 0xF});
	this.push(${(pc >> 4) & 0xF});
	this.push(${pc & 0xF});
	this.pc = ${a | ((pc - 1) & 0x1000)};
	return ${time};`,
	"RET": (pc, time, pset, write) => `
	temp = this.pop() | (this.pop() << 4) | (this.pop() << 8);
	this.pc = temp | ${(pc - 1) & 0x1000}; 
	return ${time};
	`,
	"RETS": (pc, time, pset, write) => `
	temp = this.pop() | (this.pop() << 4) | (this.pop() << 8) + 1;
	this.pc = (temp & 0xFFF) | ${pc & ~0xFFF});
	return ${time};
	`,
	"RETD": (pc, time, pset, write, a) => `
	this.pc = this.pop() | (this.pop() << 4) | (this.pop() << 8) | ${(pc - 1) & 0x1000}; 
	this.write(this.x, ${a & 0xF}); 
	this.x = (this.x + 1) & 0xFFF; 
	this.write(this.x, ${a >> 4}); 
	this.x = (this.x + 1) & 0xFFF; 
	return ${time};
	`,

	"NOP": () => "",
	"PSET": () => ""
};

export default function Dynamic(pc, single) {
	var pset = pc & ~0xFF;
	var time = 0;
	var lines = [];

	var instruction;
	do {
		var code = ProgramRom[pc];
		var instruction = Table.find((g) => (code & g.mask) === g.test);
		var template = Templates[instruction.op];

		if (!template) {
			throw new Error(`Unhandled operation ${instruction.op}`);
		}

		var word = code & ~instruction.mask;
		time += instruction.cycles;

		lines.push(`/* ${ pc.toString(16) }: ${ Disassemble(instruction, pset, word, code) } */`);

		var write_function = write_translate[instruction.args[0]] || write_translate.fallback;
		var prearg = [++pc, time, pset, write_function(word)];
		var args = prearg.concat(instruction.args.map((arg) => read_translate[arg](word)));
		var out = template.apply(null, args);

		switch (instruction.condition) {
			case 'Z':  out = `if (this.z)  { ${out} }`; break ;
			case 'NZ': out = `if (!this.z) { ${out} }`; break ;
			case 'C':  out = `if (this.c)  { ${out} }`; break ;
			case 'NC': out = `if (!this.c) { ${out} }`; break ;
		}

		lines.push(out);

		pset = (instruction.op == "PSET") ? (word << 8) : ((pc - 1) & 0x1F00);
	} while (!instruction.terminate || instruction.condition);

	return Function(`var temp;\n${lines.join("\n")}`);
}
