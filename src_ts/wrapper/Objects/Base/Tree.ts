import Entity from "./Entity"

export default class Tree extends Entity {
	public readonly m_pBaseEntity!: C_DOTA_MapTree

	get IsAlive(): boolean {
		return this.m_pBaseEntity.m_bActive
	}
	get BinaryID(): number {
		return this.m_pBaseEntity.m_nBinaryID
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_MapTree", Tree)
