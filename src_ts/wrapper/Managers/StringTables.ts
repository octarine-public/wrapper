import Events from "./Events"
import { OnActiveModifiersChanged } from "./ModifierManager"

let StringTables = new Map<string, Map<number, [string, string]>>()
declare global {
	var DumpStringTables: () => void
	var StringTables_: typeof StringTables
}
globalThis.StringTables_ = StringTables

Events.on("RemoveAllStringTables", () => {
	StringTables.clear()
})
Events.on("UpdateStringTable", (name, update) => {
	if (!StringTables.has(name))
		StringTables.set(name, new Map())
	if (name !== "ActiveModifiers") {
		let table = StringTables.get(name)!
		// loop-optimizer: KEEP
		update.forEach((val, key) => table.set(key, val))
	} else
		OnActiveModifiersChanged(update)
})

globalThis.DumpStringTables = () => {
	// loop-optimizer: KEEP
	StringTables.forEach((map, name) => {
		console.log(name)
		// loop-optimizer: KEEP
		map.forEach((pair, index) => console.log(index, pair[0], pair[1]))
	})
}

export function GetTable(table_name: string) {
	return StringTables.get(table_name)
}
export function GetString(table_name: string, index: number): string {
	let ar = GetTable(table_name)?.get(index)
	return ar !== undefined ? ar[0] : ""
}
export function GetValue(table_name: string, index: number): string {
	let ar = GetTable(table_name)?.get(index)
	return ar !== undefined ? ar[1] : ""
}
