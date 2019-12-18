const STRING = '"'
const NODE_OPEN = '{'
const NODE_CLOSE = '}'
const BR_OPEN = '['
const BR_CLOSE = ']'
const COMMENT = '/'
const CR = '\r'
const LF = '\n'
const SPACE = ' '
const TAB = '\t'
const WHITESPACE = [SPACE, '\t', '\r', '\n', '=']

class Stream {
	constructor(public readonly buf: string, public pos = 0) { }

	public RelativeSeek(s: number): Stream {
		this.pos += s
		return this
	}
	public SeekLine(): Stream {
		let found = this.buf.indexOf("\n", this.pos)
		if (found === -1)
			found = this.buf.length - 1
		this.pos = found + 1
		return this
	}
	public Next(): string {
		return this.buf.charAt(this.pos++)
	}
	public ReadString(size: number): string {
		let str = this.buf.substring(this.pos, this.pos + size)
		this.RelativeSeek(size)
		return str
	}
	public Empty(): boolean {
		return this.pos >= this.buf.length
	}
}

function _symtostr(stream: Stream, token: string): string {
	if (stream.buf.indexOf(token, stream.pos) === -1)
		return ""
	let str = "",
		escape_next_char = false,
		start_pos = stream.pos
	while (!stream.Empty()) {
		let ch = stream.Next()
		if (escape_next_char) {
			escape_next_char = false
			try {
				str += JSON.parse(`"\\${ch}"`)
			} catch {
				str += ch
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

function _unquotedtostr(stream: Stream): string {
	let str = ""
	while (!stream.Empty()) {
		let ch = stream.Next()
		if (WHITESPACE.includes(ch))
			break
		str += ch
	}
	return str
}

function _parse(stream: Stream, map = new Map<string, any>()): Map<string, any> {
	var laststr: string,
		lasttok: string,
		lastbrk: string,
		next_is_value = false

	while (!stream.Empty()) {
		var c = stream.Next()

		if (c === NODE_OPEN) {
			next_is_value = false  // Make sure the next string is interpreted as a key.
			if (!map.has(laststr))
				map.set(laststr, new Map<string, any>())
			_parse(stream, map.get(laststr))
		} else if (c === NODE_CLOSE) {
			return map
		} else if (c === BR_OPEN)
			lastbrk = _symtostr(stream, BR_CLOSE)
		else if (c === COMMENT) {
			if (stream.Next() === COMMENT)
				stream.SeekLine()
			else
				stream.RelativeSeek(-1) // cancel read
		} else if (c === CR) {
			stream.SeekLine()
			c = LF
		} else if (c === LF) {
		} else if (c !== SPACE && c !== TAB && c !== "=") {
			let string: string
			if (c === STRING) {
				string = _symtostr(stream, STRING)
			} else {
				stream.RelativeSeek(-1)
				string = _unquotedtostr(stream)
			}

			if (lasttok === STRING && next_is_value) {
				if (map.has(laststr) && lastbrk !== undefined)
					lastbrk = undefined  // Ignore this sentry if it's the second bracketed expression
				else
					map.set(laststr, string)
			}
			c = STRING  // Force c == string so lasttok will be set properly.
			laststr = string
			next_is_value = !next_is_value
		} else
			c = lasttok

		lasttok = c
	}

	return map
}

export type RecursiveMap = Map<string, RecursiveMap | string>
export function parseKV(data: string): RecursiveMap {
	return _parse(new Stream(data))
}
