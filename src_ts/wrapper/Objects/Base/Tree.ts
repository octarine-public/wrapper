import Entity from "./Entity"

export default class Tree extends Entity {
	public NativeEntity: Nullable<C_DOTA_MapTree>

	get IsAlive(): boolean {
		return this.NativeEntity?.m_bActive ?? true
	}
	get BinaryID(): number {
		return this.NativeEntity?.m_nBinaryID ?? 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_MapTree", Tree)
