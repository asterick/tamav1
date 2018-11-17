#!/usr/bin/env python
from struct import unpack
import re

def words(fo):
	pattern = re.compile(r".*?(([01]_?){12})", re.MULTILINE | re.DOTALL)

	count = 0
	for line in fo.readlines():
		match = pattern.match(line)
		
		if not match:
			continue

		bits, _ = match.groups(0)
		yield "0b%s" % bits.replace("_", '')

with file("./disassembly.txt", "r") as fi:
	with file("./src/data/tama.js", "w") as fo:
		fo.write("export default [%s]" % ', '.join(words(fi)))
