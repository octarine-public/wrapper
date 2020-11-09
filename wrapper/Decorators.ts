import { RegisterClass, RegisterFieldHandler } from "./Objects/NativeToSDK"
import Entity from "./Objects/Base/Entity"

export function WrapperClass(networked_class_name: string) {
	return (constructor: object) => RegisterClass(networked_class_name, constructor as Constructor<Entity>)
}

export function NetworkedBasicField(networked_field_name: string) {
	return (target: object, prop_name: string) =>
		RegisterFieldHandler(target.constructor as Constructor<Entity>, networked_field_name, (ent, new_val) => (ent as any)[prop_name] = new_val)
}

// just because sometimes dota transfers BigInts like numbers
export function NetworkedBigIntField(networked_field_name: string) {
	return (target: object, prop_name: string) =>
		RegisterFieldHandler(target.constructor as Constructor<Entity>, networked_field_name, (ent, new_val) => (ent as any)[prop_name] = BigInt(new_val))
}
