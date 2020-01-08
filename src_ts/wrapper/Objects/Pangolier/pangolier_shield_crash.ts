import Ability from "../Base/Ability"

export default class pangolier_shield_crash extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pangolier_ShieldCrash

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
	public get AbilityDamage(): number {
		return this.GetSpecialValue("damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pangolier_shield_crash", pangolier_shield_crash)
