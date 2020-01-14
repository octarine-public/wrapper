import Entity from "./Base/Entity"

let constructors = new Map<string, Constructor<Entity>>(),
	sdk_classes: Constructor<Entity>[] = []

export function RegisterClass(name: string, constructor: Constructor<Entity>) {
	constructors.set(name, constructor)
	sdk_classes.push(constructor)
}

export function GetSDKClasses(): Constructor<Entity>[] {
	return sdk_classes
}

export default function GetConstructor(ent: C_BaseEntity, constructor_name_hint: string) {
	if (constructors.has(constructor_name_hint))
		return constructors.get(constructor_name_hint)

	let constructor = ent.constructor
	while (constructor.name !== "Object" && !constructors.has(constructor.name))
		constructor = Object.getPrototypeOf(constructor.prototype).constructor
	return constructors.get(constructor.name)
}
