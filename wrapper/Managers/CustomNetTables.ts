import { StringTables } from "./StringTables"

export function GetValue(tableName: string, key: string): Nullable<RecursiveMap> {
	const table = StringTables.GetTable(`CustomNetTable_${tableName}`)
	if (table === undefined) {
		return undefined
	}
	for (const [entryKey, entryData] of table) {
		if (entryKey === key) {
			return parseKVBlock(new Uint8Array(entryData))
		}
	}
	return undefined
}
