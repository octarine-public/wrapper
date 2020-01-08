import Ability from "../Base/Ability"

export default class crystal_maiden_brilliance_aura extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_CrystalMaiden_BrillianceAura

	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("crystal_maiden_brilliance_aura", crystal_maiden_brilliance_aura)
