import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"

export function MapToNumberArray(map: RecursiveMap): number[] {
	return [...map.values()]
		.filter(val => typeof val === "bigint" || typeof val === "number")
		.map(val => Number(val))
}

export function MapToStringArray(map: RecursiveMap): string[] {
	return [...map.values()].filter(val => typeof val === "string") as string[]
}

export function MapToVector3(map: RecursiveMap): Vector3 {
	const ar = MapToNumberArray(map)
	return new Vector3(ar[0] ?? 0, ar[1] ?? 0, ar[2] ?? 0)
}

export function MapToVector4(map: RecursiveMap): Vector4 {
	const ar = MapToNumberArray(map)
	return new Vector4(ar[0] ?? 0, ar[1] ?? 0, ar[2] ?? 0, ar[3] ?? 0)
}

export function MapToVector3Array(map: RecursiveMap): Vector3[] {
	const ar: Vector3[] = []
	map.forEach(val => {
		if (!(val instanceof Map))
			return
		ar.push(MapToVector3(val))
	})
	return ar
}

export function MapToVector4Array(map: RecursiveMap): Vector4[] {
	const ar: Vector4[] = []
	map.forEach(val => {
		if (!(val instanceof Map))
			return
		ar.push(MapToVector4(val))
	})
	return ar
}

export function GetMapNumberProperty(map: RecursiveMap, key: string): number {
	let value = map.get(key)
	if (typeof value === "bigint")
		value = Number(value)
	if (typeof value === "string")
		value = parseFloat(value)
	return typeof value === "number"
		? value
		: 0
}

export function GetMapStringProperty(map: RecursiveMap, key: string): string {
	const value = map.get(key)
	return typeof value === "string"
		? value
		: ""
}
