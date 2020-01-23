import Entity from "./Base/Entity"
import { EntityPropertyType } from "../Managers/EntityManager"

type FieldHandler = (entity: Entity, new_value: EntityPropertyType) => void
let constructors = new Map<string, Constructor<Entity>>(),
	field_handlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>(),
	field_event_handlers = new Map<Constructor<Entity>, Map<string, FieldHandler>>(),
	sdk_classes: Constructor<Entity>[] = []

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	sdk_classes.push(constructor)

	{
		let map = new Map<string, FieldHandler>()
		let prototype = constructor.prototype
		for (let [constructor_, map_] of field_handlers)
			if (prototype instanceof constructor_)
				for (let [k, v] of map_)
					map.set(k, v)
		field_handlers.set(constructor, map)
	}
	{
		let map = new Map<string, FieldHandler>()
		let prototype = constructor.prototype
		for (let [constructor_, map_] of field_event_handlers)
			if (prototype instanceof constructor_)
				for (let [k, v] of map_)
					map.set(k, v)
		field_event_handlers.set(constructor, map)
	}
}
export function RegisterFieldHandler<T extends Entity>(constructor: Constructor<T>, field_name: string, handler: (entity: T, new_value: EntityPropertyType) => void) {
	let handler_ = handler as FieldHandler
	field_handlers.get(constructor)!.set(field_name, handler_)
	for (let [constructor_, map] of field_handlers)
		if (constructor_.prototype instanceof constructor)
			map.set(field_name, handler_)
}
export function RegisterEventFieldHandler<T extends Entity>(constructor: Constructor<T>, field_name: string, handler: (entity: T, new_value: EntityPropertyType) => void) {
	let handler_ = handler as FieldHandler
	field_event_handlers.get(constructor)!.set(field_name, handler_)
	for (let [constructor_, map] of field_event_handlers)
		if (constructor_.prototype instanceof constructor)
			map.set(field_name, handler_)
}

export function GetSDKClasses(): Constructor<Entity>[] {
	return sdk_classes
}
export function GetFieldHandlers(constructor: Constructor<Entity>): Map<string, FieldHandler> {
	return field_handlers.get(constructor)!
}
export function GetFieldEventHandlers(constructor: Constructor<Entity>): Map<string, FieldHandler> {
	return field_event_handlers.get(constructor)!
}

export default function GetConstructor(constructor: Constructor<any>, constructor_name_hint: string) {
	if (constructors.has(constructor_name_hint))
		return constructors.get(constructor_name_hint)

	while (constructor.name !== "Object" && !constructors.has(constructor.name))
		constructor = Object.getPrototypeOf(constructor.prototype).constructor
	return constructors.get(constructor.name)
}
