import Events from "./Events"

let StringTables = global.StringTables = new Map<string, Map<number, [string, string]>>()
Events.on("RemoveAllStringTables", () => {
	StringTables.clear()
})
Events.on("UpdateStringTable", (name, update) => {
	if (!StringTables.has(name))
		StringTables.set(name, new Map())
	let table = StringTables.get(name)
	// loop-optimizer: KEEP
	update.forEach((val, key) => table.set(key, val))
})

global.DumpStringTables = () => {
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
	let ar = StringTables.get(table_name)?.get(index)
	return ar !== undefined ? ar[0] : undefined
}