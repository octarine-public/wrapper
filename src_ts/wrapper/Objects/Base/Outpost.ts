import Building from "./Building"

export default class Outpost extends Building {
	public readonly m_pBaseEntity!: C_DOTA_BaseNPC_Watch_Tower

	get IsOutpost(): boolean {
		return true
	}

	get OutpostName(): string {
		return this.m_pBaseEntity.m_szOutpostName
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Watch_Tower", Outpost)
