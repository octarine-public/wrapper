import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { EventsSDK } from "./EventsSDK"

export const StringTables = new (class CStringTablesManager {
	private readonly tables = new Map<string, Map<number, [string, ArrayBuffer]>>()

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
		const ar = this.GetTable(tableName)?.get(index)
		if (ar === undefined) {
			return ""
		}
		const stream = new ViewBinaryStream(new DataView(ar[1]))
		return stream.ReadUtf8String(stream.Remaining)
	}

	public GetString(tableName: string, index: number): string {
		const ar = this.GetTable(tableName)?.get(index)
		return ar !== undefined ? ar[0] : ""
	}

	public UpdateStringTable(name: string, update: Map<number, [string, ArrayBuffer]>) {
		const stringTables = this.tables
		if (!stringTables.has(name)) {
			stringTables.set(name, new Map())
		}
		const table = stringTables.get(name)!
		update.forEach((val, key) => table.set(key, [val[0], val[1]]))
	}

	public RemoveAllStringTables() {
		this.tables.clear()
	}
})()

EventsSDK.on("UpdateStringTable", (name, update) =>
	StringTables.UpdateStringTable(name, update)
)

EventsSDK.on("RemoveAllStringTables", () => StringTables.RemoveAllStringTables())
