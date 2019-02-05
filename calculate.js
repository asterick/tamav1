const table = require("./src/system/table.js")

const count = {};

table.forEach(entry => {
	const name = count[entry.args.length] || (count[entry.args.length] = {})
	
	name[entry.op] = true
})

console.log(count);
