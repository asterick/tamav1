const reg_table = ["A", "B", "MX", "MY"];

export default function(instruction, pset, word, code) {
	var hex = (0x1000 | code).toString(16).substr(1);

	var args = instruction.args.map(translate);
	if (instruction.condition) args = [instruction.condition].concat(args);

	function translate(arg) {
		switch (arg) {
			case "A": case "B": case "BA": 
			case "XL": case "XH": case "XP": case "XB":
			case "YL": case "YH": case "YP": case "YB":
			case "SPL": case "SPH":
			case "F":
			case "MX": case "MY":
				return arg;
			case "M{I}":
				return `M${(word & 0xF).toString(10)}`;
			case "{I}":
				return `#$${word.toString(16)}`;
			case "{I4}":
				return `#$${(word & 0xF).toString(16)}`;
			case "{X}":
				return reg_table[word & 0x3];
			case "{Y}":
				return reg_table[(word >> 2) & 0x3];
			case "{Z}":
				return reg_table[(word >> 4) & 0x3];
			default:
				throw new Error(arg);
		}
	}

	return `${instruction.op} ${args.join(", ")} ; $${hex}`;
}