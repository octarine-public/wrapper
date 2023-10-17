import { EntityPropertyType } from "../Base/EntityProperties"
import { Events } from "../Managers/Events"
import { ParseProtobufDesc, ParseProtobufNamed } from "../Utils/Protobuf"
import { MapToObject } from "../Utils/Utils"
import { Entity } from "./Base/Entity"

export type FieldHandler = (entity: Entity, newValue: EntityPropertyType) => any
export const ClassToEntities = new Map<Constructor<any>, Entity[]>(),
	ClassToEntitiesAr = new Map<Constructor<any>, Entity[][]>(),
	SDKClasses: [Constructor<Entity>, Entity[]][] = [],
	FieldHandlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>()
const constructors = new Map<string, Constructor<Entity>>()
export const CachedFieldHandlers = new Map<
	Constructor<Entity>,
	Map<number, FieldHandler>
>()

function RegisterClassInternal(constructor: Constructor<Entity>) {
	const prototype = constructor.prototype
	if (!ClassToEntities.has(constructor)) {
		const ar: Entity[][] = [[]]
		ClassToEntities.set(constructor, ar[0])
		for (const [constr, entitiesAr] of SDKClasses) {
			if (prototype instanceof constr) {
				ar.push(entitiesAr)
			}
		}
		ClassToEntitiesAr.set(constructor, ar)
	}
	if (!CachedFieldHandlers.has(constructor)) {
		CachedFieldHandlers.set(constructor, new Map())
	}
	SDKClasses.push([constructor, ClassToEntities.get(constructor)!])
	const map = new Map<string, FieldHandler>()
	for (const [constr, classFieldHandlers] of FieldHandlers) {
		if (prototype instanceof constr) {
			for (const [k, v] of classFieldHandlers) {
				map.set(k, v)
			}
		}
	}
	FieldHandlers.set(constructor, map)
}

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	if (!FieldHandlers.has(constructor)) {
		RegisterClassInternal(constructor)
	}
}

function GenerateChainedFieldHandler(old: FieldHandler, new_: FieldHandler) {
	return (ent: Entity, newVal: EntityPropertyType) => {
		old(ent, newVal)
		new_(ent, newVal)
	}
}
export function RegisterFieldHandler<T extends Entity>(
	constructor: Constructor<T>,
	fieldName: string,
	handler: (entity: T, newValue: EntityPropertyType) => any
) {
	if (!FieldHandlers.has(constructor)) {
		RegisterClassInternal(constructor)
	}
	const map = FieldHandlers.get(constructor)!
	let handler_ = handler as FieldHandler
	if (map.has(fieldName)) {
		handler_ = GenerateChainedFieldHandler(map.get(fieldName)!, handler_)
	}
	map.set(fieldName, handler_)

	const map2 = CachedFieldHandlers.get(constructor)!
	const id = EntitiesSymbols.indexOf(fieldName)
	if (id === -1) {
		if (EntitiesSymbols.length !== 0) {
			console.log(
				`[WARNING] Index of "${fieldName}" not found in CSVCMsg_FlattenedSerializer.`
			)
		}
		return
	}
	map2.set(id, handler_)
}

function FixClassNameForMap<T>(
	constructorName: string,
	map: Map<string, T>
): Nullable<string> {
	if (map.has(constructorName)) {
		return constructorName
	}

	if (constructorName[0] === "C" && constructorName[1] !== "_") {
		constructorName = `C_${constructorName.substring(1)}`
		if (map.has(constructorName)) {
			return constructorName
		}
	}
	if (constructorName[0] === "C" && constructorName[1] === "_") {
		constructorName = `C${constructorName.substring(2)}`
		if (map.has(constructorName)) {
			return constructorName
		}
	}

	return undefined
}

export function GetConstructorByName(
	className: string,
	constructorNameHint?: string
): Nullable<Constructor<Entity>> {
	if (constructorNameHint !== undefined && constructors.has(constructorNameHint)) {
		return constructors.get(constructorNameHint)
	}

	const fixedWrapperName = FixClassNameForMap(className, constructors)
	if (fixedWrapperName !== undefined) {
		return constructors.get(fixedWrapperName)
	}

	const fixedClassName = FixClassNameForMap(className, SchemaClassesInheritance)
	if (fixedClassName === undefined) {
		console.error(
			`Can't fix classname ${className}, so we can't walk its' inheritance, and class isn't declared in wrapper.`
		)
		return undefined
	}

	// if neither fixed or original class name have got wrapped entities - try to walk up inherited classes
	const inherited = SchemaClassesInheritance.get(fixedClassName)!
	for (const inheritedClassName of inherited) {
		const constructor = GetConstructorByName(inheritedClassName)
		if (constructor !== undefined) {
			return constructor
		}
	}
	console.error(
		`Can't find wrapper declared inherited classes for classname ${className}, [${inherited}]`
	)
	return undefined
}

function FixType(symbols: string[], field: any): string {
	{
		const fieldSerializerNameSym = field.field_serializer_name_sym
		if (fieldSerializerNameSym !== undefined) {
			return (
				symbols[fieldSerializerNameSym] +
				(field.field_serializer_version !== 0
					? field.field_serializer_version
					: "")
			)
		}
	}
	let type = symbols[field.var_type_sym]
	// types
	type = type.replace(/\<\s/g, "<")
	type = type.replace(/\s\>/g, ">")
	type = type.replace(/CNetworkedQuantizedFloat/g, "float")
	type = type.replace(/GameTime_t/g, "float")
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

ParseProtobufDesc(`
message ProtoFlattenedSerializerField_t {
	message polymorphic_field_t {
		optional int32 polymorphic_field_serializer_name_sym = 1;
		optional int32 polymorphic_field_serializer_version = 2;
	}

	optional int32 var_type_sym = 1;
	optional int32 var_name_sym = 2;
	optional int32 bit_count = 3;
	optional float low_value = 4;
	optional float high_value = 5;
	optional int32 encode_flags = 6;
	optional int32 field_serializer_name_sym = 7;
	optional int32 field_serializer_version = 8;
	optional int32 send_node_sym = 9;
	optional int32 var_encoder_sym = 10;
	repeated .ProtoFlattenedSerializerField_t.polymorphic_field_t polymorphic_types = 11;
}

message ProtoFlattenedSerializer_t {
	optional int32 serializer_name_sym = 1;
	optional int32 serializer_version = 2;
	repeated int32 fields_index = 3;
}

message CSVCMsg_FlattenedSerializer {
	repeated .ProtoFlattenedSerializer_t serializers = 1;
	repeated string symbols = 2;
	repeated .ProtoFlattenedSerializerField_t fields = 3;
}
`)
export let EntitiesSymbols: string[] = []
Events.on("ServerMessage", (msgID, buf) => {
	switch (msgID) {
		case 41: {
			const msg = ParseProtobufNamed(
				new Uint8Array(buf),
				"CSVCMsg_FlattenedSerializer"
			)
			if ((globalThis as any).dump_d_ts) {
				const obj = MapToObject(msg)
				const list = Object.values(obj.serializers).map((ser: any) => [
					obj.symbols[ser.serializer_name_sym] +
						(ser.serializer_version !== 0 ? ser.serializer_version : ""),
					Object.values(ser.fields_index).map((fieldID: any) => {
						const field = obj.fields[fieldID]
						return [
							FixType(obj.symbols as string[], field),
							obj.symbols[field.var_name_sym]
						]
					})
				])
				console.log(
					"dump_CSVCMsg_FlattenedSerializer.d.ts",
					`\
import { Vector2, Vector3, QAngle, Vector4 } from "github.com/octarine-public/wrapper/index"

type Color = number // 0xAABBGGRR?
type HSequence = number
type item_definition_index_t = number
type itemid_t = number
type style_index_t = number

${list
	.map(
		([name, fields]) => `\
declare class ${name} {
	${(fields as [string, string][]).map(([type, fName]) => `${fName}: ${type}`).join("\n\t")}
}`
	)
	.join("\n\n")}
`
				)
			}
			EntitiesSymbols = (msg.get("symbols") as string[]).map(sym => {
				if (sym.startsWith("DOTA")) {
					return `C${sym}`
				}
				return sym
			})
			for (const [construct, map] of FieldHandlers) {
				const map2 = CachedFieldHandlers.get(construct)!
				for (const [fieldName, fieldHandler] of map) {
					const id = EntitiesSymbols.indexOf(fieldName)
					if (id === -1) {
						console.log(
							`[WARNING] Index of "${fieldName}" not found in CSVCMsg_FlattenedSerializer.`
						)
						continue
					}
					map2.set(id, fieldHandler)
				}
			}
			break
		}
	}
})
