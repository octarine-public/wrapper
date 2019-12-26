import Unit from "./Unit"

export default class Creep extends Unit {
	public readonly m_pBaseEntity!: C_DOTA_BaseNPC_Creep

	get IsCreep(): boolean {
		return true
	}
	get IsLaneCreep(): boolean {
		return this.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Lane
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Creep", Creep)
