import Ability from "../../Base/Ability"

export default class nyx_assassin_impale extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Nyx_Assassin_Impale

	public get AOERadius(): number {
		return this.GetSpecialValue("width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_impale", nyx_assassin_impale)
