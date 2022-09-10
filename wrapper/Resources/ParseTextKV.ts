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
const WHITESPACE = [SPACE, "\t", "\r", "\n", "="]

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
	const stack: [string, string, string, boolean, RecursiveMap][] = []
	let laststr = "",
		lasttok = "",
		lastbrk = "",
		nextIsValue = false,
		map = out

	while (!stream.Empty()) {
		const start_pos = stream.pos
		let c = stream.ReadChar()

		switch (c) {
			case NODE_OPEN: {
				nextIsValue = false  // Make sure the next string is interpreted as a key.
				if (map.has(laststr)) {
					let cnt = 0
					while (map.has(laststr + cnt))
						cnt++
					laststr += cnt
				}
				const x = new Map()
				map.set(laststr, x)
				stack.push([laststr, lasttok, lastbrk, nextIsValue, map])
				laststr = ""
				lasttok = ""
				lastbrk = ""
				nextIsValue = false
				map = x
				break
			}
			case NODE_CLOSE:
				if (stack.length === 0)
					return out
				const [laststr_, lasttok_, lastbrk_, nextIsValue_, map_] = stack.pop()!
				laststr = laststr_
				lasttok = lasttok_
				lastbrk = lastbrk_
				nextIsValue = nextIsValue_
				map = map_
				break
			case BR_OPEN:
				lastbrk = _symtostr(stream, BR_CLOSE)
				break
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
				c = lasttok
				break
			default: {
				let str: string
				if (c !== STRING) {
					stream.pos = start_pos
					str = _unquotedtostr(stream)
				} else
					str = _symtostr(stream, STRING)

				if (lasttok === STRING && nextIsValue) {
					if (lastbrk !== "" && map.has(laststr))
						lastbrk = "" // Ignore this sentry if it's the second bracketed expression
					else
						map.set(laststr, str)
				}
				c = STRING // Force c == str so lasttok will be set properly.
				laststr = str
				nextIsValue = !nextIsValue
				break
			}
		}
		lasttok = c
	}

	return out
}
