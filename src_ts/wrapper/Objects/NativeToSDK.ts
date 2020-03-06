import Entity from "./Base/Entity"
import { EntityPropertyType } from "../Managers/EntityManager"

export type FieldHandler = (entity: Entity, new_value: EntityPropertyType) => void
let constructors = new Map<string, Constructor<Entity>>(),
	field_handlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>(),
	sdk_classes: Constructor<Entity>[] = []

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	sdk_classes.push(constructor)

	let map = new Map<string, FieldHandler>()
	let prototype = constructor.prototype
	for (let [constructor_, map_] of field_handlers)
		if (prototype instanceof constructor_)
			for (let [k, v] of map_)
				map.set(k, v)
	field_handlers.set(constructor, map)
}

function GenerateChaninedFieldHandler(old: FieldHandler, new_: FieldHandler) {
	return (ent: Entity, new_val: EntityPropertyType) => {
		old(ent, new_val)
		new_(ent, new_val)
	}
}
export function RegisterFieldHandler<T extends Entity>(constructor: Constructor<T>, field_name: string, handler: (entity: T, new_value: EntityPropertyType) => void) {
	let handler_ = handler as FieldHandler,
		map = field_handlers.get(constructor)!
	if (map.has(field_name))
		handler_ = GenerateChaninedFieldHandler(map.get(field_name)!, handler_)
	map.set(field_name, handler_)
}
export function ReplaceFieldHandler<T extends Entity>(constructor: Constructor<T>, field_name: string, handler: (entity: T, new_value: EntityPropertyType) => void) {
	field_handlers.get(constructor)!.set(field_name, handler as FieldHandler)
}

export function GetSDKClasses(): Constructor<Entity>[] {
	return sdk_classes
}
export function GetFieldHandlers(): Map<Constructor<Entity>, Map<string, FieldHandler>> {
	return field_handlers
}

export default function GetConstructor(constructor: Constructor<any>, constructor_name_hint: string) {
	if (constructors.has(constructor_name_hint))
		return constructors.get(constructor_name_hint)

	while (constructor.name !== "Object" && !constructors.has(constructor.name))
		constructor = Object.getPrototypeOf(constructor.prototype).constructor
	return constructors.get(constructor.name)
}
