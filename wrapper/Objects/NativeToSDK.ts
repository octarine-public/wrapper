import { EntityPropertyType } from "../Base/EntityProperties"
import Events from "../Managers/Events"
import { ParseProtobufNamed } from "../Utils/Protobuf"
import { MapToObject } from "../Utils/Utils"
import ViewBinaryStream from "../Utils/ViewBinaryStream"
import Entity from "./Base/Entity"

export type FieldHandler = (entity: Entity, new_value: EntityPropertyType) => any
export const ClassToEntities = new Map<Constructor<any>, Entity[]>(),
	ClassToEntitiesAr = new Map<Constructor<any>, Entity[][]>(),
	SDKClasses: [Constructor<Entity>, Entity[]][] = [],
	FieldHandlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>()
const constructors = new Map<string, Constructor<Entity>>()
export const cached_field_handlers = new Map<Constructor<Entity>, Map<number, FieldHandler>>()

function RegisterClassInternal(constructor: Constructor<Entity>) {
	const prototype = constructor.prototype
	if (!ClassToEntities.has(constructor)) {
		const ar: Entity[][] = [[]]
		ClassToEntities.set(constructor, ar[0])
		for (const [constructor_, ar_] of SDKClasses)
			if (prototype instanceof constructor_)
				ar.push(ar_)
		ClassToEntitiesAr.set(constructor, ar)
	}
	if (!cached_field_handlers.has(constructor))
		cached_field_handlers.set(constructor, new Map())
	SDKClasses.push([constructor, ClassToEntities.get(constructor)!])
	const map = new Map<string, FieldHandler>()
	for (const [constructor_, map_] of FieldHandlers)
		if (prototype instanceof constructor_)
			for (const [k, v] of map_)
				map.set(k, v)
	FieldHandlers.set(constructor, map)
}

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	if (!FieldHandlers.has(constructor))
		RegisterClassInternal(constructor)
}

function GenerateChainedFieldHandler(old: FieldHandler, new_: FieldHandler) {
	return (ent: Entity, new_val: EntityPropertyType) => {
		old(ent, new_val)
		new_(ent, new_val)
	}
}
export function RegisterFieldHandler<T extends Entity>(
	constructor: Constructor<T>,
	field_name: string,
	handler: (entity: T, new_value: EntityPropertyType) => any,
) {
	if (!FieldHandlers.has(constructor))
		RegisterClassInternal(constructor)
	const map = FieldHandlers.get(constructor)!
	let handler_ = handler as FieldHandler
	if (map.has(field_name))
		handler_ = GenerateChainedFieldHandler(map.get(field_name)!, handler_)
	map.set(field_name, handler_)

	const map2 = cached_field_handlers.get(constructor)!
	const id = entities_symbols.indexOf(field_name)
	if (id === -1) {
		if (entities_symbols.length !== 0)
			console.log(`[WARNING] Index of "${field_name}" not found in CSVCMsg_FlattenedSerializer.`)
		return
	}
	map2.set(id, handler_)
}

function FixClassNameForMap<T>(constructor_name: string, map: Map<string, T>): Nullable<string> {
	if (map.has(constructor_name))
		return constructor_name

	if (constructor_name[0] === "C" && constructor_name[1] !== "_") {
		constructor_name = `C_${constructor_name.substring(1)}`
		if (map.has(constructor_name))
			return constructor_name
	}
	if (constructor_name[0] === "C" && constructor_name[1] === "_") {
		constructor_name = `C${constructor_name.substring(2)}`
		if (map.has(constructor_name))
			return constructor_name
	}

	return undefined
}

export default function GetConstructorByName(class_name: string, constructor_name_hint?: string): Nullable<Constructor<Entity>> {
	if (constructor_name_hint !== undefined && constructors.has(constructor_name_hint))
		return constructors.get(constructor_name_hint)

	const fixed_wrapper_name = FixClassNameForMap(class_name, constructors)
	if (fixed_wrapper_name !== undefined)
		return constructors.get(fixed_wrapper_name)

	const fixed_class_name = FixClassNameForMap(class_name, SchemaClassesInheritance)
	if (fixed_class_name === undefined) {
		console.error(`Can't fix classname ${class_name}, so we can't walk its' inheritance, and class isn't declared in wrapper.`)
		return undefined
	}

	// if neither fixed or original class name have got wrapped entities - try to walk up inherited classes
	const inherited = SchemaClassesInheritance.get(fixed_class_name)!
	for (const inherited_class_name of inherited) {
		const constructor = GetConstructorByName(inherited_class_name)
		if (constructor !== undefined)
			return constructor
	}
	console.error(`Can't find wrapper declared inherited classes for classname ${class_name}, [${inherited}]`)
	return undefined
}

function FixType(symbols: string[], field: any): string {
	{
		const field_serializer_name_sym = field.field_serializer_name_sym
		if (field_serializer_name_sym !== undefined)
			return symbols[field_serializer_name_sym] + (field.field_serializer_version !== 0 ? field.field_serializer_version : "")
	}
	let type = symbols[field.var_type_sym]
	// types
	type = type.replace(/\<\s/g, "<")
	type = type.replace(/\s\>/g, ">")
	type = type.replace(/CNetworkedQuantizedFloat/g, "float")
	type = type.replace(/CUtlVector\<(.*)\>/g, "$1[]")
	type = type.replace(/CNetworkUtlVectorBase\<(.*)\>/g, "$1[]")
	type = type.replace(/CHandle\<(.*)\>/g, "CEntityIndex<$1>")
	type = type.replace(/CStrongHandle\<(.*)\>/g, "CStrongHandle<$1>")
	type = type.replace(/Vector2D/g, "Vector2")
	type = type.replace(/Vector4D|Quaternion/g, "Vector4")
	type = type.replace(/Vector$/g, "Vector3")
	type = type.replace(/Vector([^\d])/g, "Vector3$1")

	// fix arrays
	type = type.replace(/\[\d+\]/g, "[]")

	// primitives
	type = type.replace(/bool/g, "boolean")
	type = type.replace(/double/g, "number")
	type = type.replace(/uint64/g, "bigint")
	type = type.replace(/int64/g, "bigint")
	type = type.replace(/float(32|64)?/g, "number")
	type = type.replace(/u?int(\d+)/g, "number")
	type = type.replace(/CUtlStringToken/g, "CStringToken")
	type = type.replace(/CUtlString|CUtlSymbolLarge|char(\*|\[\])/g, "string")
	type = type.replace(/CStringToken/g, "CUtlStringToken")

	// omit pointers
	type = type.replace(/\*/g, "")

	return type
}

export let entities_symbols: string[] = []
Events.on("ServerMessage", async (msg_id, buf) => {
	switch (msg_id) {
		case 41: {
			const msg = ParseProtobufNamed(new ViewBinaryStream(new DataView(buf)), "CSVCMsg_FlattenedSerializer")
			if ((globalThis as any).dump_d_ts) {
				const obj = MapToObject(msg)
				const list = Object.values(obj.serializers).map((ser: any) => [
					obj.symbols[ser.serializer_name_sym] + (ser.serializer_version !== 0 ? ser.serializer_version : ""),
					Object.values(ser.fields_index).map((field_id: any) => {
						const field = obj.fields[field_id]
						return [
							FixType(obj.symbols as string[], field),
							obj.symbols[field.var_name_sym],
						]
					}),
				])
				console.log("dump_CSVCMsg_FlattenedSerializer.d.ts", `\
import { Vector2, Vector3, QAngle, Vector4 } from "github.com/octarine-public/wrapper/wrapper/Imports"

type Color = number // 0xAABBGGRR?
type HSequence = number
type item_definition_index_t = number
type itemid_t = number
type style_index_t = number

${list.map(([name, fields]) => `\
declare class ${name} {
	${(fields as [string, string][]).map(([type, f_name]) => `${f_name}: ${type}`).join("\n\t")}
}`).join("\n\n")}
`)
			}
			entities_symbols = (msg.get("symbols") as string[]).map(sym => {
				if (sym.startsWith("DOTA"))
					return `C${sym}`
				return sym
			})
			for (const [construct, map] of FieldHandlers) {
				const map2 = cached_field_handlers.get(construct)!
				for (const [field_name, field_handler] of map) {
					const id = entities_symbols.indexOf(field_name)
					if (id === -1) {
						console.log(`[WARNING] Index of "${field_name}" not found in CSVCMsg_FlattenedSerializer.`)
						continue
					}
					map2.set(id, field_handler)
				}
			}
			break
		}
	}
})
