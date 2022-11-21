import { Vector2 } from "./Base/Vector2"
import { Vector3 } from "./Base/Vector3"
import { Vector4 } from "./Base/Vector4"
import { EPropertyType, PropertyType } from "./Enums/PropertyType"
import { Entity } from "./Objects/Base/Entity"
import { RegisterClass, RegisterFieldHandler } from "./Objects/NativeToSDK"

export function WrapperClass(networkedClassName: string) {
	return (constructor: object) =>
		RegisterClass(networkedClassName, constructor as Constructor<Entity>)
}

const convertBuf = new ArrayBuffer(16)
const convertUint8 = new Uint8Array(convertBuf),
	convertUint32 = new Uint32Array(convertBuf),
	convertUint64 = new BigUint64Array(convertBuf),
	convertFloat32 = new Float32Array(convertBuf)
function ReencodeProperty(
	prop: any,
	newType: EPropertyType,
	networkedType: EPropertyType
): PropertyType {
	convertUint8.fill(0)
	if (typeof prop === "string") {
		if (newType === EPropertyType.STRING) return prop
		throw `Tried to cast string to ${typeof prop} ${prop?.constructor?.name}`
	} else if (typeof prop === "boolean") {
		if (newType === EPropertyType.BOOL) return prop
		convertUint8[0] = prop ? 1 : 0
	} else if (typeof prop === "number") {
		if (
			networkedType === EPropertyType.INT32 ||
			networkedType === EPropertyType.INT16 ||
			networkedType === EPropertyType.INT8
		) {
			prop <<= 1
			if (prop < 0) {
				prop *= -1
				prop |= 1
			}
		}
		convertUint32[0] = prop
	} else if (typeof prop === "bigint") {
		if (networkedType === EPropertyType.INT64) {
			prop <<= 1n
			if (prop < 0n) {
				prop *= -1n
				prop |= 1n
			}
		}
		convertUint64[0] = prop
	} else if (prop instanceof Vector4) {
		convertFloat32[0] = prop.x
		convertFloat32[1] = prop.y
		convertFloat32[2] = prop.z
		convertFloat32[3] = prop.w
	} else if (prop instanceof Vector3) {
		convertFloat32[0] = prop.x
		convertFloat32[1] = prop.y
		convertFloat32[2] = prop.z
	} else if (prop instanceof Vector2) {
		convertFloat32[0] = prop.x
		convertFloat32[1] = prop.y
	} else
		throw `Tried to cast ${typeof prop} ${prop?.constructor?.name} to string`

	switch (newType) {
		case EPropertyType.INT8:
		case EPropertyType.INT16:
		case EPropertyType.INT32: {
			let val = convertUint32[0]
			if ((val & 1) !== 0) val *= -1
			val >>= 1
			return val
		}
		case EPropertyType.INT64: {
			let val = convertUint64[0]
			if ((val & 1n) !== 0n) val *= -1n
			val >>= 1n
			return val
		}
		case EPropertyType.UINT8:
		case EPropertyType.UINT16:
		case EPropertyType.UINT32:
			return convertUint32[0]
		case EPropertyType.UINT64:
			return convertUint64[0]
		case EPropertyType.BOOL:
			return convertUint8[0] !== 0
		case EPropertyType.FLOAT:
			return convertFloat32[0]
		case EPropertyType.VECTOR2:
			return new Vector2(convertFloat32[0], convertFloat32[1])
		case EPropertyType.VECTOR3:
			return new Vector3(
				convertFloat32[0],
				convertFloat32[1],
				convertFloat32[2]
			)
		case EPropertyType.QUATERNION:
			return new Vector4(
				convertFloat32[0],
				convertFloat32[1],
				convertFloat32[2],
				convertFloat32[3]
			)
		case EPropertyType.STRING:
			throw `Tried to convert: ${newType} to string`
		default:
			throw `Unknown PropertyType: ${newType}`
	}
}

export function NetworkedBasicField(
	networkedFieldName: string,
	propType = EPropertyType.INVALID,
	networkedType = EPropertyType.INVALID
) {
	return (target: object, propName: string) => {
		RegisterFieldHandler(
			target.constructor as Constructor<Entity>,
			networkedFieldName,
			(ent, newVal) => {
				if (propType !== EPropertyType.INVALID)
					newVal = ReencodeProperty(newVal, propType, networkedType)
				const entAny = ent as any
				entAny[propName] = newVal
			}
		)
	}
}
