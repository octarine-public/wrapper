import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"

export type PropertyType =
	| string
	| bigint
	| number
	| boolean
	| Vector2
	| Vector3
	| Vector4
/**
 * The type byte octarine-core writes before every networked value. Its numbers are
 * `butterfly::PropertyType`'s; the 8- and 16-bit widths fill the gaps it leaves for them
 */
export const enum EPropertyType {
	BOOL,
	INT8,
	INT16,
	INT32,
	INT64,
	UINT8,
	UINT16,
	UINT32,
	UINT64,
	FLOAT,
	STRING,
	VECTOR2,
	VECTOR3,
	VECTOR4,
	TRANSFORM,
	/**
	 * Not a property type: the protocol tag octarine-core writes in a type's place before a
	 * dynamic array's element count. A wire value, it stays 15 and past every type
	 */
	SERIALIZED_ARRAY_SIZE = 15,
	INVALID = -1
}
