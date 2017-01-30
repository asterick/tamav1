#!/usr/bin/env python
from struct import unpack

def words(fo):
	while True:
		word = fo.read(2)
		if not word:
			break
		yield unpack(">H", word)

with file("./raw/tama.b", "rb") as fi:
	with file("./src/data/tama.js", "w") as fo:
		fo.write("export default [%s]" % ', '.join([str(c) for c, in words(fi)]))
