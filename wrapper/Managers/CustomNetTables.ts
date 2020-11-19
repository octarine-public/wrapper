import { BinaryKV, parseVBKV } from "../Utils/VBKV"
import { GetTable } from "./StringTables"

export function GetValue(table_name: string, key: string): Nullable<Map<string, BinaryKV>> {
	const table = GetTable(`CustomNetTable_${table_name}`)
	if (table === undefined)
		return undefined

	for (const [, ar] of table)
		if (ar[0] === key)
			try {
				return parseVBKV(new Uint8Array(ar[1]))
			} catch {
				break
			}
	return undefined
}
