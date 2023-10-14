import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { EventsSDK } from "./EventsSDK"

const stringTables = new Map<string, Map<number, [string, ArrayBuffer]>>()

const globalThisAny = globalThis as any
globalThisAny.StringTables = stringTables

EventsSDK.on("RemoveAllStringTables", () => stringTables.clear())
EventsSDK.on("UpdateStringTable", (name, update) => {
	if (!stringTables.has(name)) {
		stringTables.set(name, new Map())
	}
	const table = stringTables.get(name)!
	update.forEach((val, key) => table.set(key, [val[0], val[1]]))
})

export function GetTable(tableName: string) {
	return stringTables.get(tableName)
}
export function GetString(tableName: string, index: number): string {
	const ar = GetTable(tableName)?.get(index)
	return ar !== undefined ? ar[0] : ""
}
export function GetValue(tableName: string, index: number): string {
	const ar = GetTable(tableName)?.get(index)
	if (ar === undefined) {
		return ""
	}
	const stream = new ViewBinaryStream(new DataView(ar[1]))
	return stream.ReadUtf8String(stream.Remaining)
}
