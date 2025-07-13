import { EntityPropertyType } from "../Base/EntityProperties"
import { Events } from "../Managers/Events"
import { EventsSDK } from "../Managers/EventsSDK"
import { Modifier } from "../Objects/Base/Modifier"
import { ParseProtobufDesc, ParseProtobufNamed } from "../Utils/Protobuf"
import { MapToObject } from "../Utils/Utils"
import { Entity } from "./Base/Entity"

const modifierSDKClassTempNames: string[] = []
const constructors = new Map<string, Constructor<Entity>>()
const excludedErrorClassNames = new Set<string>(["CDeferredLightBase"])

export type FieldHandler = (entity: Entity, newValue: EntityPropertyType) => any
export const SDKClasses: [Constructor<Entity>, Entity[]][] = []
export const ClassToEntities = new WeakMap<Constructor<any>, Entity[]>()
export const ModifierSDKClass = new Map<string, Constructor<Modifier>>()
export const ClassToEntitiesAr = new WeakMap<Constructor<any>, Entity[][]>()

export const CachedFieldHandlers = new WeakMap<
	Constructor<Entity>,
	Map<number, FieldHandler>
>()
export const FieldHandlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>()

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	if (!FieldHandlers.has(constructor)) {
		RegisterClassInternal(constructor)
	}
}

export function RegisterClassModifier(name: string, constructor: Constructor<Modifier>) {
	if (ModifierSDKClass.has(name)) {
		console.error(`Modifier ${name} already registered`)
		return
	}
	ModifierSDKClass.set(name, constructor)
	modifierSDKClassTempNames.push(name)
}

export function RegisterFieldHandler<A extends Entity, B = EntityPropertyType>(
	constructor: Constructor<A>,
	fieldName: string,
	handler: (entity: A, newValue: B) => any
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
	for (let i = inherited.length - 1; i > -1; i--) {
		const inheritedClassName = inherited[i]
		const constructor = GetConstructorByName(inheritedClassName)
		if (constructor !== undefined) {
			return constructor
		}
	}
	if (excludedErrorClassNames.has(className)) {
		return undefined
	}
	console.error(
		`Can't find wrapper declared inherited classes for classname ${className}, [${inherited}]`
	)
	return undefined
}

function GenerateChainedFieldHandler(old: FieldHandler, new_: FieldHandler) {
	return (ent: Entity, newVal: EntityPropertyType) => {
		old(ent, newVal)
		new_(ent, newVal)
	}
}

function RegisterClassInternal(constructor: Constructor<Entity>) {
	const prototype = constructor.prototype
	if (!ClassToEntities.has(constructor)) {
		const ar: Entity[][] = [[]]
		ClassToEntities.set(constructor, ar[0])
		for (let i = 0, end = SDKClasses.length; i < end; i++) {
			const [constr, entitiesAr] = SDKClasses[i]
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

	FieldHandlers.forEach((classFieldHandlers, constr) => {
		if (prototype instanceof constr) {
			classFieldHandlers.forEach((v, k) => map.set(k, v))
		}
	})

	FieldHandlers.set(constructor, map)
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
	const dec = `// low: ${field.low_value ?? 0} high: ${field.high_value ?? 1} flags: ${field.encode_flags ?? 0} bits: ${field.bit_count ?? 0}`
	let type = symbols[field.var_type_sym]
	// types
	type = type.replace(/\<\s/g, "<")
	type = type.replace(/\s\>/g, ">")
	type = type.replace(/CNetworkedQuantizedFloat/g, `float ${dec}`)
	type = type.replace(/GameTime_t/g, "float")
	type = type.replace(/CUtlVector\<(.*)\>/g, "$1[]")
	type = type.replace(/CNetworkUtlVectorBase\<(.*)\>/g, "$1[]")
	type = type.replace(/CHandle\<(.*)\>/g, "CEntityIndex<$1>")
	type = type.replace(/CStrongHandle\<(.*)\>/g, "CStrongHandle<$1>")
	type = type.replace(/Vector2D/g, `Vector2 ${dec}`)
	type = type.replace(/Vector4D|Quaternion/g, `Vector4 ${dec}`)
	type = type.replace(/Vector$/g, `Vector3 ${dec}`)
	type = type.replace(/QAngle/g, `QAngle ${dec}`)
	type = type.replace(/Vector([^\d])/g, `Vector3$1 ${dec}`)

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

	{
		const varEncoderSym = field.var_encoder_sym
		if (varEncoderSym !== undefined) {
			type += `/* encoder: ${symbols[varEncoderSym]} */`
		}
	}

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
	optional int32 var_serializer_sym = 12;
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
			EntitiesSymbols = (msg.get("symbols") as string[]).map(sym =>
				sym.startsWith("DOTA") ? `C${sym}` : sym
			)
			FieldHandlers.forEach((map, construct) => {
				const map2 = CachedFieldHandlers.get(construct)!
				map2.clear()
				map.forEach((fieldHandler, fieldName) => {
					const id = EntitiesSymbols.indexOf(fieldName)
					if (id === -1) {
						console.log(
							`[WARNING] Index of "${fieldName}" not found in CSVCMsg_FlattenedSerializer.`
						)
						return
					}
					map2.set(id, fieldHandler)
				})
			})
			break
		}
	}
})

EventsSDK.on("UpdateStringTable", (name, update) => {
	if (name !== "ModifierNames" || modifierSDKClassTempNames.length === 0) {
		return
	}
	const arrTables = [...update.values()]
	for (let i = modifierSDKClassTempNames.length - 1; i > -1; i--) {
		const modName = modifierSDKClassTempNames[i]
		if (!arrTables.some(([modifierName]) => modifierName === modName)) {
			console.error(`Modifier class name ${modName} can't be found in string table`)
		}
		modifierSDKClassTempNames.remove(modName)
	}
})
