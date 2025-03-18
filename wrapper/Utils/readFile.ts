import { EventPriority } from "../Enums/EventPriority"
import { EventsSDK } from "../Managers/EventsSDK"

const fexistsCache = new Set<string>(),
	fexistsCacheInv = new Set<string>()
export function tryFindFile(path: string, callstackDepth = 0): Nullable<string> {
	if (fexistsCache.has(path)) {
		return path
	}
	if (!fexistsCacheInv.has(path) && fexists(path)) {
		fexistsCache.add(path)
		return path
	}
	fexistsCacheInv.add(path)

	const callerStr = new Error().stack!.split("\n")[2 + callstackDepth]
	const callerExec = /^\s{4}at\s(?:.+\s\()?(.+):\d+:\d+(?:\))?$/.exec(callerStr)
	if (callerExec === null) {
		return undefined
	}

	const caller = callerExec[1]
	if (caller === "<anonymous>") {
		return undefined
	}

	const callerAr = caller.split("/")
	callerAr.pop() // remove script filename
	while (callerAr.length !== 0) {
		const currentPath = `${callerAr.join("/")}/scripts_files/${path}`
		if (fexistsCache.has(currentPath)) {
			return currentPath
		}
		if (!fexistsCacheInv.has(currentPath) && fexists(currentPath)) {
			fexistsCache.add(currentPath)
			return currentPath
		}
		fexistsCacheInv.add(currentPath)
		callerAr.pop() // script file is probably lying in some folder, try traversing upwards
	}

	// no match either in dota files nor in scripts_files
	return undefined
}

export function readFile(path: string, callstackDepth = 0): Nullable<string> {
	const realPath = tryFindFile(path, 1 + callstackDepth)
	if (realPath === undefined) {
		return undefined
	}

	return fread(realPath, false)
}

EventsSDK.on(
	"ServerInfo",
	() => {
		fexistsCache.clear()
		fexistsCacheInv.clear()
	},
	EventPriority.IMMEDIATE
)
