import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"

export type PropertyType = string | bigint | number | boolean | Vector2 | Vector3 | Vector4
export enum EPropertyType {
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
	QUATERNION,
	INVALID = -1,
}
