export function tryFindFile(
	path: string,
	callstackDepth = 0
): Nullable<string> {
	if (fexists(path)) return path

	const callerStr = new Error().stack!.split("\n")[2 + callstackDepth]
	const callerExec = /^\s{4}at\s(?:.+\s\()?(.+):\d+:\d+(?:\))?$/.exec(callerStr)
	if (callerExec === null) return undefined

	const caller = callerExec[1]
	if (caller === "<anonymous>") return undefined

	const callerAr = caller.split("/")
	callerAr.pop() // remove script filename
	while (callerAr.length !== 0) {
		const currentPath = `${callerAr.join("/")}/scripts_files/${path}`
		if (fexists(currentPath)) return currentPath
		callerAr.pop() // script file is probably lying in some folder, try traversing upwards
	}

	// no match either in dota files nor in scripts_files
	return undefined
}

export function readFile(
	path: string,
	callstackDepth = 0
): Nullable<FileStream> {
	const realPath = tryFindFile(path, 1 + callstackDepth)
	if (realPath === undefined) return undefined

	return fopen(realPath)
}
