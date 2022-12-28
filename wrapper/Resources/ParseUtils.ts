import { Matrix4x4Identity } from "../Base/Matrix"
import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"

export function MapToNumberArray(
	map: RecursiveMap | RecursiveMapValue[]
): number[] {
	if (map instanceof Map) map = [...map.values()]
	return map
		.filter(val => typeof val === "bigint" || typeof val === "number")
		.map(val => Number(val))
}

export function MapToBooleanArray(
	map: RecursiveMap | RecursiveMapValue[]
): boolean[] {
	if (map instanceof Map) map = [...map.values()]
	return map.map(val => !!val)
}

export function MapToStringArray(
	map: RecursiveMap | RecursiveMapValue[]
): string[] {
	if (map instanceof Map) map = [...map.values()]
	return map.filter(val => typeof val === "string") as string[]
}

export function MapToVector3(map: RecursiveMap | RecursiveMapValue[]): Vector3 {
	return Vector3.fromArray(MapToNumberArray(map))
}

export function MapToQuaternion(
	map: RecursiveMap | RecursiveMapValue[]
): Vector4 {
	const ar = MapToNumberArray(map)
	return new Vector4(ar[0] ?? 0, ar[1] ?? 0, ar[2] ?? 0, ar[3] ?? 1)
}

export function MapToMatrix4x4(
	map: RecursiveMap | RecursiveMapValue[]
): number[] {
	const ar: number[] = []
	map.forEach((el: RecursiveMapValue) => {
		if (el instanceof Map || Array.isArray(el)) {
			const vec = MapToNumberArray(el)
			ar.push(vec[0] ?? 0, vec[1] ?? 0, vec[2] ?? 0, vec[3] ?? 0)
		}
	})
	if (ar.length < 16) ar.push(...Matrix4x4Identity.slice(ar.length))
	else if (ar.length > 16) ar.splice(16)
	return ar
}

export function MapToVector3Array(
	map: RecursiveMap | RecursiveMapValue[]
): Vector3[] {
	const ar: Vector3[] = []
	map.forEach((val: RecursiveMapValue) => {
		if (val instanceof Map || Array.isArray(val)) ar.push(MapToVector3(val))
	})
	return ar
}

export function MapToQuaternionArray(
	map: RecursiveMap | RecursiveMapValue[]
): Vector4[] {
	const ar: Vector4[] = []
	map.forEach((val: RecursiveMapValue) => {
		if (val instanceof Map || Array.isArray(val)) ar.push(MapToQuaternion(val))
	})
	return ar
}

export function MapValueToNumber(value: any, defaultValue = 0) {
	if (typeof value === "bigint") value = Number(value)
	if (typeof value === "string") value = parseFloat(value)
	return typeof value === "number" ? value : defaultValue
}

export function GetMapNumberProperty(
	map: RecursiveMap,
	key: string,
	defaultValue = 0
): number {
	return MapValueToNumber(map.get(key), defaultValue)
}

export function MapValueToString(value: any) {
	return typeof value === "string" ? value : ""
}

export function GetMapStringProperty(map: RecursiveMap, key: string): string {
	return MapValueToString(map.get(key))
}
