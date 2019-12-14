import Unit from "../Base/Unit"

export default class Roshan extends Unit {
	public readonly m_pBaseEntity: C_DOTA_Unit_Roshan

	public get GoldenRoshan(): boolean {
		return this.m_pBaseEntity.m_bGoldenRoshan
	}
	public get LastHealthPercent(): number {
		return this.m_pBaseEntity.m_iLastHealthPercent
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Roshan", Roshan)
