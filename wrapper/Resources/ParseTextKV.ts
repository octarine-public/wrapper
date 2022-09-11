const STRING = '"'
const NODE_OPEN = "{"
const NODE_CLOSE = "}"
const BR_OPEN = "["
const BR_CLOSE = "]"
const COMMENT = "/"
const CR = "\r"
const LF = "\n"
const SPACE = " "
const TAB = "\t"
const WHITESPACE = [SPACE, "\t", "\r", "\n", "=", ","]

function _symtostr(stream: ReadableBinaryStream, token: string): string {
	const start_pos = stream.pos
	let str = "",
		escape_next_char = false
	while (!stream.Empty()) {
		const ch = stream.ReadChar()
		if (escape_next_char) {
			escape_next_char = false
			switch (ch) {
				case "r":
					str += "\r"
					break
				case "n":
					str += "\n"
					break
				case "t":
					str += "\t"
					break
				default:
					str += ch
					break
			}
			continue
		}
		if (ch === "\\") {
			escape_next_char = true
			continue
		}
		if (ch === token)
			return str
		str += ch
	}
	stream.pos = start_pos
	return ""
}

function _unquotedtostr(stream: ReadableBinaryStream): string {
	let str = ""
	while (!stream.Empty()) {
		const ch = stream.ReadChar()
		if (WHITESPACE.includes(ch))
			break
		str += ch
	}
	return str
}

export function parseTextKV(stream: ReadableBinaryStream, out = new Map<string, any>()): RecursiveMap {
	const stack: [string, string, boolean, boolean, number, RecursiveMap][] = []
	let laststr = "",
		lasttok = "",
		nextIsValue = false,
		isArray = false,
		currentArrayIndex = 0,
		map = out,
		isInComment = false

	while (!stream.Empty()) {
		const start_pos = stream.pos
		let c = stream.ReadChar()

		if (isInComment) {
			const start_pos2 = stream.pos
			// -->
			if (
				stream.Remaining >= 2
				&& c === "-"
				&& stream.ReadChar() === "-"
				&& stream.ReadChar() === ">"
			)
				isInComment = false
			else
				stream.pos = start_pos2
			continue
		}

		switch (c) {
			case NODE_OPEN: {
				nextIsValue = false // Make sure the next string is interpreted as a key.
				const fake_node = map.size === 0 && laststr === ""
				if (!fake_node && map.has(laststr)) {
					let cnt = 0
					while (map.has(laststr + cnt))
						cnt++
					laststr += cnt
				}
				stack.push([laststr, lasttok, nextIsValue, isArray, currentArrayIndex, map])
				if (!fake_node) {
					const x = new Map()
					map.set(laststr, x)
					laststr = ""
					lasttok = ""
					nextIsValue = false
					isArray = false
					currentArrayIndex = 0
					map = x
				}
				break
			}
			case BR_CLOSE:
			case NODE_CLOSE:
				if (stack.length === 0)
					return out
				const [laststr_, lasttok_, nextIsValue_, isArray_, currentArrayIndex_, map_] = stack.pop()!
				laststr = laststr_
				lasttok = lasttok_
				nextIsValue = nextIsValue_
				isArray = isArray_
				currentArrayIndex = currentArrayIndex_
				map = map_
				break
			case BR_OPEN: {
				nextIsValue = false // Make sure the next string is interpreted as a key.
				if (map.has(laststr)) {
					let cnt = 0
					while (map.has(laststr + cnt))
						cnt++
					laststr += cnt
				}
				const x = new Map()
				map.set(laststr, x)
				stack.push([laststr, lasttok, nextIsValue, isArray, currentArrayIndex, map])
				laststr = ""
				lasttok = ""
				nextIsValue = false
				isArray = true
				currentArrayIndex = 0
				map = x
				break
			}
			case COMMENT: {
				const start_pos2 = stream.pos
				if (stream.ReadChar() === COMMENT)
					stream.SeekLine()
				else
					stream.pos = start_pos2
				break
			}
			case CR:
				stream.SeekLine()
				break
			case LF:
				// just skip it
				break
			case SPACE:
			case TAB:
			case "=":
			case ",":
				c = lasttok
				break
			case "<": {
				const start_pos2 = stream.pos
				// <!--
				if (
					stream.Remaining >= 3
					&& stream.ReadChar() === "!"
					&& stream.ReadChar() === "-"
					&& stream.ReadChar() === "-"
				) {
					isInComment = true
					break
				} else
					stream.pos = start_pos2
				// fallthrough
			}
			default: {
				let str: string
				if (c !== STRING) {
					stream.pos = start_pos
					str = _unquotedtostr(stream)
				} else
					str = _symtostr(stream, STRING)

				if (!isArray) {
					if (lasttok === STRING && nextIsValue)
						map.set(laststr, str)
					laststr = str
					nextIsValue = !nextIsValue
				} else
					map.set((currentArrayIndex++).toString(), str)
				c = STRING // Force c == str so lasttok will be set properly.
				break
			}
		}
		lasttok = c
	}

	return out
}
