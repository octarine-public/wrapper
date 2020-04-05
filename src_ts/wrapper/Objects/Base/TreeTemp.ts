import Entity from "./Entity"
import Vector3 from "../../Base/Vector3"

export default class TempTree extends Entity {
	public NativeEntity: Nullable<C_DOTA_TempTree>
	public CircleCenter = new Vector3()

	public get RingRadius(): number {
		return 100
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_TempTree", TempTree)
RegisterFieldHandler(TempTree, "m_vecTreeCircleCenter", (tree, new_value) => tree.CircleCenter = new_value as Vector3)
