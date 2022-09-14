export function tryFindFile(path: string, callstack_depth = 0): Nullable<string> {
	if (fexists(path))
		return path

	const caller_str = new Error().stack!.split("\n")[2 + callstack_depth]
	const caller_exec = /^\s{4}at\s(?:.+\s\()?(.+):\d+:\d+(?:\))?$/.exec(caller_str)
	if (caller_exec === null)
		return undefined

	const caller = caller_exec[1]
	if (caller === "<anonymous>")
		return undefined

	const caller_ar = caller.split("/")
	caller_ar.pop() // remove script filename
	while (caller_ar.length !== 0) {
		const current_path = `${caller_ar.join("/")}/scripts_files/${path}`
		if (fexists(current_path))
			return current_path
		caller_ar.pop() // script file is probably lying in some folder, try traversing upwards
	}

	// no match either in dota files nor in scripts_files
	return undefined
}

export function readFile(path: string, callstack_depth = 0): Nullable<FileStream> {
	const real_path = tryFindFile(path, 1 + callstack_depth)
	if (real_path === undefined)
		return undefined

	return fopen(real_path)
}
