import { StringTables } from "./StringTables"

export function GetValue(tableName: string, key: string): Nullable<RecursiveMap> {
	const table = StringTables.GetTable(`CustomNetTable_${tableName}`)
	if (table === undefined) {
		return undefined
	}
	let value: Nullable<RecursiveMap>
	table.forEach(ar => {
		if (ar[0] === key) {
			value = parseKVBlock(new Uint8Array(ar[1]))
		}
	})
	return value
}
