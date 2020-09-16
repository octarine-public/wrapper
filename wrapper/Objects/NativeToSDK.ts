import Entity from "./Base/Entity"
import { EntityPropertyType } from "../Managers/EntityManager"

export type FieldHandler = (entity: Entity, new_value: EntityPropertyType) => void
let constructors = new Map<string, Constructor<Entity>>(),
	field_handlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>(),
	sdk_classes: [Constructor<Entity>, string][] = []

function RegisterClassInternal(constructor: Constructor<Entity>) {
	sdk_classes.push([constructor, constructor.name])
	let map = new Map<string, FieldHandler>()
	let prototype = constructor.prototype
	for (let [constructor_, map_] of field_handlers)
		if (prototype instanceof constructor_)
			for (let [k, v] of map_)
				map.set(k, v)
	field_handlers.set(constructor, map)
}

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	if (!field_handlers.has(constructor))
		RegisterClassInternal(constructor)
}

function GenerateChainedFieldHandler(old: FieldHandler, new_: FieldHandler) {
	return (ent: Entity, new_val: EntityPropertyType) => {
		old(ent, new_val)
		new_(ent, new_val)
	}
}
export function RegisterFieldHandler<T extends Entity>(constructor: Constructor<T>, field_name: string, handler: (entity: T, new_value: EntityPropertyType) => void) {
	if (!field_handlers.has(constructor))
		RegisterClassInternal(constructor)
	let handler_ = handler as FieldHandler,
		map = field_handlers.get(constructor)!
	if (map.has(field_name))
		handler_ = GenerateChainedFieldHandler(map.get(field_name)!, handler_)
	map.set(field_name, handler_)
}
export function ReplaceFieldHandler<T extends Entity>(constructor: Constructor<T>, field_name: string, handler: (entity: T, new_value: EntityPropertyType) => void) {
	field_handlers.get(constructor)!.set(field_name, handler as FieldHandler)
}

export function GetSDKClasses(): [Constructor<Entity>, string][] {
	return sdk_classes
}
export function GetFieldHandlers(): Map<Constructor<Entity>, Map<string, FieldHandler>> {
	return field_handlers
}

function FixClassName(constructor_name: string): Nullable<string> {
	if (SchemaClassesInheritance.has(constructor_name))
		return constructor_name

	if (constructor_name[0] === "C" && constructor_name[1] !== "_") {
		constructor_name = `C_${constructor_name.substring(1)}`
		if (SchemaClassesInheritance.has(constructor_name))
			return constructor_name
	}
	if (constructor_name[0] === "C" && constructor_name[1] === "_") {
		constructor_name = `C${constructor_name.substring(2)}`
		if (SchemaClassesInheritance.has(constructor_name))
			return constructor_name
	}

	return undefined
}

export default function GetConstructorByName(class_name: string, constructor_name_hint?: string): Nullable<Constructor<Entity>> {
	if (constructor_name_hint !== undefined && constructors.has(constructor_name_hint))
		return constructors.get(constructor_name_hint)

	let fixed_class_name = FixClassName(class_name)
	if (fixed_class_name === undefined)
		return undefined

	if (fixed_class_name !== undefined && !constructors.has(fixed_class_name))
		for (let class_name of SchemaClassesInheritance.get(fixed_class_name)!) {
			let constructor = GetConstructorByName(class_name)
			if (constructor !== undefined)
				return constructor
		}
	return constructors.get(fixed_class_name)
}
