import { GetTable } from "./StringTables"

export function GetValue(tableName: string, key: string): Nullable<RecursiveMap> {
	const table = GetTable(`CustomNetTable_${tableName}`)
	if (table === undefined) {
		return undefined
	}

	for (const [, ar] of table) {
		if (ar[0] === key) {
			try {
				return parseKVBlock(new Uint8Array(ar[1]))
			} catch {
				break
			}
		}
	}
	return undefined
}
