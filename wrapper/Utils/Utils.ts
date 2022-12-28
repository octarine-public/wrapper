import { FileBinaryStream } from "./FileBinaryStream"
import { readFile } from "./readFile"

export function parseEnumString(
	enumObject: any /* { [key: string]: number } */,
	str: string
): number {
	const regex = /(\w+)\s?(\||\&|\+|\-)?/g // it's in variable to preserve RegExp#exec steps
	let lastTok = "",
		res = 0
	while (true) {
		const regexRes = regex.exec(str)
		if (regexRes === null) return res
		const parsedName = (enumObject[regexRes[1]] as number | undefined) ?? 0
		switch (lastTok) {
			case "&":
				res &= parsedName
				break
			case "|":
				res |= parsedName
				break
			case "+":
				res += parsedName
				break
			case "-":
				res -= parsedName
				break
			default:
				res = parsedName
				break
		}
		lastTok = regexRes[2] || ""
	}
}

function FixArray(ar: any[]): any {
	return ar.map(v =>
		v instanceof Map ? MapToObject(v) : Array.isArray(v) ? FixArray(v) : v
	)
}

export function MapToObject(map: Map<any, any>): any {
	const obj: any = {}
	map.forEach(
		(v, k) =>
			(obj[k] =
				v instanceof Map ? MapToObject(v) : Array.isArray(v) ? FixArray(v) : v)
	)
	return obj
}

export function ParseMapName(path: string): Nullable<string> {
	const res = /maps(\/|\\)(.+)\.vpk$/.exec(path)
	if (res === null) return undefined

	const mapName = res[2]
	if (mapName.startsWith("scenes") || mapName.startsWith("prefabs"))
		// that must not be loaded as main map, so we must ignore it
		return undefined
	return mapName
}

export function readJSON(path: string): any {
	const buf = readFile(path, 1)
	if (buf === undefined) throw `Failed to read JSON file at path ${path}`
	const stream = new FileBinaryStream(buf)
	try {
		return JSON.parse(stream.ReadUtf8String(stream.Remaining))
	} catch {
		throw `invalid JSON at path ${path}`
	} finally {
		buf.close()
	}
}

type CompareFunc<T> = (a: T, b: T) => number
function partition<T>(
	items: T[],
	cmpFunc: CompareFunc<T>,
	left: number,
	right: number
) {
	const pivot = items[Math.floor((right + left) / 2)]
	let i = left,
		j = right
	while (i <= j) {
		while (cmpFunc(items[i], pivot) < 0) i++
		while (cmpFunc(items[j], pivot) > 0) j--
		if (i > j) break

		const temp = items[i]
		items[i] = items[j]
		items[j] = temp

		i++
		j--
	}
	return i
}

export function qsort<T>(
	items: T[],
	cmpFunc: CompareFunc<T>,
	left = 0,
	right = items.length - 1
) {
	if (items.length > 1) {
		const index = partition(items, cmpFunc, left, right)
		if (left < index - 1) qsort(items, cmpFunc, left, index - 1)
		if (index < right) qsort(items, cmpFunc, index, right)
	}
	return items
}

function insertMapElement<K, V>(map: Map<K, V>, k: K, v: V): void {
	if (map.has(k) && v instanceof Map) {
		const prevVal = map.get(k)
		if (prevVal instanceof Map) {
			v.forEach((v2, k2) => insertMapElement(prevVal, k2, v2))
		} else map.set(k, v)
	} else map.set(k, v)
}

export function createMapFromMergedIterators<K, V>(
	...iters: IterableIterator<[K, V]>[]
): Map<K, V> {
	const map = new Map<K, V>()
	for (const iter of iters)
		for (const [k, v] of iter) insertMapElement(map, k, v)
	return map
}
