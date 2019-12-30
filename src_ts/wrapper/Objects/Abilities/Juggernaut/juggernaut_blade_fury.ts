import Ability from "../../Base/Ability"

export default class juggernaut_blade_fury extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Juggernaut_BladeFury

	public get AOERadius(): number {
		return this.GetSpecialValue("blade_fury_radius")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("juggernaut_blade_fury", juggernaut_blade_fury)
