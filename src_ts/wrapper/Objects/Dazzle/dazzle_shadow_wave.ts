import Ability from "../Base/Ability"

export default class dazzle_shadow_wave extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Dazzle_ShadowWave

	public get AOERadius(): number {
		return this.GetSpecialValue("damage_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_shadow_wave", dazzle_shadow_wave)
