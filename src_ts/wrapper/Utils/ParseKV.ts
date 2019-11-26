/* tslint:disable */

/// tokenize ///
function tokenizeKV(data) {
	data = data.toString()
	data = (data as string).replace("}\t\t}", "}\n\t\t}")
	return data
		.split("\n")
		.map((s, i) => {
			return { text: s.trim(), line: i + 1 }
		}).filter(s => s.text.length).filter(s => s.text.substr(0, 2) !== "//").map(tokenizeLine)
}

function tokenizeLine(entry) {
	var tokens = []
	entry.text
		.split(/(["\\\\])/g)
		.filter(s => s.length)
		.map(token => {
			var tparts = token.split("//")
			token = tparts.shift()

			tokens.push(token)
			if (tparts.length) {
				tokens.push("//" + tparts.join("//"))
			}
			return token
		})
	entry.tokens = tokens
	return entry
}

/// Index ///
export function parseKV(data) {
	var lines = tokenizeKV(data)
	var result = Object.create(null)
	result.values = Object.create(null)
	var currentResult = result
	var popStack = rootPopStack

	Object.defineProperty(currentResult, "comments", {
		enumerable: false,
		value: Object.create(null),
	})

	// state variables
	var stack = []
	var key = null
	var value = null
	var temporaryStack = ""
	var isInQuotes = false
	var isInComment = false
	var isEscaping = false
	// loop-optimizer: KEEP
	lines.forEach(entry => {
		var line = entry.tokens
		var comment = ""
		// loop-optimizer: KEEP
		line.forEach(token => {
			if (isInComment) {
				if (token[0] === '"') {
					comment += " "
				}
				comment += token
				return
			}
			if (!isInQuotes) {
				token = token.trim()
				if (!token.length) {
					return
				}
			}
			switch (token) {
				case "\\":
					isEscaping = true
					return
				case '"':
					if (isEscaping) {
						isEscaping = false
						break
					}
					isInQuotes = !isInQuotes
					if (!isInQuotes) {
						if (!key) {
							key = temporaryStack
						} else if (value === null) {
							value = temporaryStack
						} else if (isInComment) {
							// do nothing, this a comment
							comment += token
						} else if (key && value) {
							currentResult.values[key] = value
							key = temporaryStack
							value = null
						} else {
							throw new Error("Too many values on line " + entry.line)
						}
						temporaryStack = ""
					}
					return
				case "{":
					if (!temporaryStack) {
						if (key && !value) {
							temporaryStack = key
							key = ""
						} else {
							throw new Error('Unexpected "{" character on line ' + entry.line)
						}
					}
					pushStack(temporaryStack)
					temporaryStack = ""
					return
				case "}":
					return popStack()
			}
			if (isInQuotes) {
				if (isEscaping) {
					isEscaping = false
					temporaryStack += "\\"
				}
				temporaryStack += token
			} else if (token.substr(0, 2) === "//") {
				isInComment = true
				comment = token.substr(2)
			} else if (isInComment) {
				comment += token
			} else {
				throw new Error('Unexpected token "' + token + '" on line ' + entry.line)
			}
		})
		if (isInQuotes) {
			console.log("Invalid line: ", entry)
			// throw new Error('Unmatched close quotation on line ' + entry.line);
			return
		}
		if (temporaryStack.length) {
			console.log("leftover stack", temporaryStack)
		}
		temporaryStack = ""
		if (key && value === null) {
			temporaryStack = key
			currentResult.comments[key] = comment.trim()
		} else if (key !== null && value !== null) {
			currentResult.values[key] = value
			if (comment.length) {
				// console.log(key, comment);
				currentResult.comments[key] = comment.trim()
			}
			// Object.defineProperty(  , 'comment', {
			//   enumerable: false,
			//   value: comment
			// });
		}
		key = null
		value = null
		isInComment = false
		comment = ""
	})

	return result

	function pushStack(title) {
		var _popStack = popStack
		var parentResult = currentResult

		stack.push(title)

		currentResult[title] = {
			values: {},
		}
		currentResult = currentResult[title]

		Object.defineProperty(currentResult, "comments", {
			enumerable: false,
			value: {},
		})

		popStack = () => {
			popStack = _popStack
			currentResult = parentResult
		}
	}

	function rootPopStack() {
		throw new Error('Unexpected "}"')
	}
}
