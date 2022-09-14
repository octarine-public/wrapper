import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { EventsSDK } from "./EventsSDK"

const StringTables = new Map<string, Map<number, [string, ArrayBuffer]>>()
declare global {
	var DumpStringTables: () => void
	var StringTables_: typeof StringTables
}
globalThis.StringTables_ = StringTables

EventsSDK.on("RemoveAllStringTables", () => StringTables.clear())
EventsSDK.on("UpdateStringTable", (name, update) => {
	if (!StringTables.has(name))
		StringTables.set(name, new Map())
	const table = StringTables.get(name)!
	update.forEach((val, key) => table.set(key, [val[0], val[1]]))
})

globalThis.DumpStringTables = () => {
	StringTables.forEach((map, name) => {
		console.log(name)
		map.forEach((pair, index) => console.log(index, pair[0], pair[1]))
	})
}

export function GetTable(table_name: string) {
	return StringTables.get(table_name)
}
export function GetString(table_name: string, index: number): string {
	const ar = GetTable(table_name)?.get(index)
	return ar !== undefined ? ar[0] : ""
}
export function GetValue(table_name: string, index: number): string {
	const ar = GetTable(table_name)?.get(index)
	if (ar === undefined)
		return ""
	const stream = new ViewBinaryStream(new DataView(ar[1]))
	return stream.ReadUtf8String(stream.Remaining)
}
