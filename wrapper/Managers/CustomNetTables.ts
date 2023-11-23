import { GetTable } from "./StringTables"

export function GetValue(tableName: string, key: string): Nullable<RecursiveMap> {
	const table = GetTable(`CustomNetTable_${tableName}`)
	if (table === undefined) {
		return undefined
	}
	let value: Nullable<RecursiveMap>
	table.forEach(ar => {
		if (ar[0] === key) {
			try {
				value = parseKVBlock(new Uint8Array(ar[1]))
			} catch {
				// ignore ?
			}
		}
	})
	return value
}
