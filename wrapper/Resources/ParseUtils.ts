import Matrix4x4 from "../Base/Matrix4x4"
import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"

export function MapToNumberArray(map: RecursiveMap | RecursiveMapValue[]): number[] {
	if (map instanceof Map)
		map = [...map.values()]
	return map
		.filter(val => typeof val === "bigint" || typeof val === "number")
		.map(val => Number(val))
}

export function MapToBooleanArray(map: RecursiveMap | RecursiveMapValue[]): boolean[] {
	if (map instanceof Map)
		map = [...map.values()]
	return map.map(val => !!val)
}

export function MapToStringArray(map: RecursiveMap | RecursiveMapValue[]): string[] {
	if (map instanceof Map)
		map = [...map.values()]
	return map.filter(val => typeof val === "string") as string[]
}

export function MapToVector3(map: RecursiveMap | RecursiveMapValue[]): Vector3 {
	return Vector3.fromArray(MapToNumberArray(map))
}

export function MapToVector4(map: RecursiveMap | RecursiveMapValue[]): Vector4 {
	return Vector4.fromArray(MapToNumberArray(map))
}

export function MapToMatrix4x4(map: RecursiveMap | RecursiveMapValue[]): Matrix4x4 {
	const ar: number[] = []
	map.forEach((el: RecursiveMapValue) => {
		if (el instanceof Map || Array.isArray(el)) {
			const vec = MapToNumberArray(el)
			ar.push(
				vec[0] ?? 0,
				vec[1] ?? 0,
				vec[2] ?? 0,
				vec[3] ?? 0,
			)
		}
	})
	return new Matrix4x4(ar)
}

export function MapToVector3Array(map: RecursiveMap | RecursiveMapValue[]): Vector3[] {
	const ar: Vector3[] = []
	map.forEach((val: RecursiveMapValue) => {
		if (val instanceof Map || Array.isArray(val))
			ar.push(MapToVector3(val))
	})
	return ar
}

export function MapToVector4Array(map: RecursiveMap | RecursiveMapValue[]): Vector4[] {
	const ar: Vector4[] = []
	map.forEach((val: RecursiveMapValue) => {
		if (val instanceof Map || Array.isArray(val))
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
