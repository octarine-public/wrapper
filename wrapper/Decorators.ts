import Vector2 from "./Base/Vector2"
import Vector3 from "./Base/Vector3"
import Vector4 from "./Base/Vector4"
import { EPropertyType, PropertyType } from "./Enums/PropertyType"
import Entity from "./Objects/Base/Entity"
import { RegisterClass, RegisterFieldHandler } from "./Objects/NativeToSDK"

export function WrapperClass(networked_class_name: string) {
	return (constructor: object) => RegisterClass(networked_class_name, constructor as Constructor<Entity>)
}

const convert_buf = new ArrayBuffer(16)
const convert_uint8 = new Uint8Array(convert_buf),
	convert_uint32 = new Uint32Array(convert_buf),
	convert_uint64 = new BigUint64Array(convert_buf),
	convert_float32 = new Float32Array(convert_buf)
function ReencodeProperty(
	prop: any,
	new_type: EPropertyType,
	networked_type: EPropertyType,
): PropertyType {
	convert_uint8.fill(0)
	if (typeof prop === "string") {
		if (new_type === EPropertyType.STRING)
			return prop
		throw `Tried to cast string to ${typeof prop} ${prop?.constructor?.name}`
	} else if (typeof prop === "boolean") {
		if (new_type === EPropertyType.BOOL)
			return prop
		convert_uint8[0] = prop ? 1 : 0
	} else if (typeof prop === "number") {
		if (
			networked_type === EPropertyType.INT32
			|| networked_type === EPropertyType.INT16
			|| networked_type === EPropertyType.INT8
		) {
			prop <<= 1
			if (prop < 0) {
				prop *= -1
				prop |= 1
			}
		}
		convert_uint32[0] = prop
	} else if (typeof prop === "bigint") {
		if (networked_type === EPropertyType.INT64) {
			prop <<= 1n
			if (prop < 0n) {
				prop *= -1n
				prop |= 1n
			}
		}
		convert_uint64[0] = prop
	} else if (prop instanceof Vector4) {
		convert_float32[0] = prop.x
		convert_float32[1] = prop.y
		convert_float32[2] = prop.z
		convert_float32[3] = prop.w
	} else if (prop instanceof Vector3) {
		convert_float32[0] = prop.x
		convert_float32[1] = prop.y
		convert_float32[2] = prop.z
	} else if (prop instanceof Vector2) {
		convert_float32[0] = prop.x
		convert_float32[1] = prop.y
	} else
		throw `Tried to cast ${typeof prop} ${prop?.constructor?.name} to string`

	switch (new_type) {
		case EPropertyType.INT8:
		case EPropertyType.INT16:
		case EPropertyType.INT32: {
			let val = convert_uint32[0]
			if ((val & 1) !== 0)
				val *= -1
			val >>= 1
			return val
		}
		case EPropertyType.INT64: {
			let val = convert_uint64[0]
			if ((val & 1n) !== 0n)
				val *= -1n
			val >>= 1n
			return val
		}
		case EPropertyType.UINT8:
		case EPropertyType.UINT16:
		case EPropertyType.UINT32:
			return convert_uint32[0]
		case EPropertyType.UINT64:
			return convert_uint64[0]
		case EPropertyType.BOOL:
			return convert_uint8[0] !== 0
		case EPropertyType.FLOAT:
			return convert_float32[0]
		case EPropertyType.VECTOR2:
			return new Vector2(convert_float32[0], convert_float32[1])
		case EPropertyType.VECTOR3:
			return new Vector3(convert_float32[0], convert_float32[1], convert_float32[2])
		case EPropertyType.QUATERNION:
			return new Vector4(convert_float32[0], convert_float32[1], convert_float32[2], convert_float32[3])
		case EPropertyType.STRING:
			throw `Tried to convert: ${new_type} to string`
		default:
			throw `Unknown PropertyType: ${new_type}`
	}
}

export function NetworkedBasicField(
	networked_field_name: string,
	prop_type = EPropertyType.INVALID,
	networked_type = EPropertyType.INVALID,
) {
	return (target: object, prop_name: string) => {
		RegisterFieldHandler(
			target.constructor as Constructor<Entity>,
			networked_field_name,
			(ent, new_val) => {
				if (prop_type !== EPropertyType.INVALID)
					new_val = ReencodeProperty(new_val, prop_type, networked_type)
				const ent_ = ent as any
				ent_[prop_name] = new_val
			},
		)
	}
}
