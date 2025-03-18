import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { EventsSDK } from "./EventsSDK"

export const StringTables = new (class CStringTablesManager {
	private readonly tables = new Map<string, [string, ArrayBuffer][]>()

	public get Size() {
		return this.tables.size
	}

	constructor() {
		const globalThisAny = globalThis as any
		globalThisAny.StringTables = this.tables
	}

	public GetTable(tableName: string) {
		return this.tables.get(tableName)
	}

	public GetValue(tableName: string, index: number): string {
		const table = this.GetTable(tableName)
		if (table === undefined) {
			return ""
		}
		const entry = table[index]
		if (entry === undefined) {
			return ""
		}
		const stream = new ViewBinaryStream(new DataView(entry[1]))
		return stream.ReadUtf8String(stream.Remaining)
	}

	public GetString(tableName: string, index: number): string {
		const table = this.GetTable(tableName)
		if (table === undefined) {
			return ""
		}
		const entry = table[index]
		if (entry === undefined) {
			return ""
		}
		return entry[0]
	}

	public GetCustomValue(tableName: string, key: string): Nullable<RecursiveMap> {
		const table = this.GetTable(`CustomNetTable_${tableName}`)
		if (table === undefined) {
			return undefined
		}
		for (const [tableKey, value] of table) {
			if (tableKey === key) {
				return parseKVBlock(new Uint8Array(value))
			}
		}
		return undefined
	}

	public UpdateStringTable(name: string, update: Map<number, [string, ArrayBuffer]>) {
		const stringTables = this.tables
		if (!stringTables.has(name)) {
			stringTables.set(name, [])
		}
		const table = stringTables.get(name)!
		update.forEach((val, key) => {
			table[key] = [val[0], val[1]]
		})
	}

	public RemoveAllStringTables() {
		this.tables.clear()
	}
})()

EventsSDK.on("UpdateStringTable", (name, update) =>
	StringTables.UpdateStringTable(name, update)
)

EventsSDK.on("RemoveAllStringTables", () => StringTables.RemoveAllStringTables())
