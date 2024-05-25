export function MapValueToNumber(value: any, defaultValue = 0) {
	if (typeof value === "bigint") {
		value = Number(value)
	}
	if (typeof value === "string") {
		value = parseFloat(value)
	}
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

export function MapValueToBoolean(value: any) {
	switch (value) {
		case "true":
		case true:
		case "1":
		case 1:
			return true
		default:
			return false
	}
}

export function GetMapStringProperty(map: RecursiveMap, key: string): string {
	return MapValueToString(map.get(key))
}
