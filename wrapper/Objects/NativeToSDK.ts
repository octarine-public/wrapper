import { EntityPropertyType } from "../Managers/EntityManager"
import Entity from "./Base/Entity"

export type FieldHandler = (entity: Entity, new_value: EntityPropertyType) => any
export const ClassToEntities = new Map<Constructor<any>, Entity[]>(),
	SDKClasses: [Constructor<Entity>, Entity[]][] = [],
	FieldHandlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>()
const constructors = new Map<string, Constructor<Entity>>()

function RegisterClassInternal(constructor: Constructor<Entity>) {
	if (!ClassToEntities.has(constructor))
		ClassToEntities.set(constructor, [])
	SDKClasses.push([constructor, ClassToEntities.get(constructor)!])
	const map = new Map<string, FieldHandler>()
	const prototype = constructor.prototype
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
}
export function ReplaceFieldHandler<T extends Entity>(
	constructor: Constructor<T>,
	field_name: string,
	handler: (entity: T, new_value: EntityPropertyType) => any,
) {
	FieldHandlers.get(constructor)!.set(field_name, handler as FieldHandler)
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
