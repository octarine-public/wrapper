import Ability from "../../Base/Ability"

export default class troll_warlord_whirling_axes_ranged extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_TrollWarlord_WhirlingAxes_Ranged

	public get EndRadius(): number {
		return 206.17 // no in special data
	}

	public get CastRange(): number {
		return this.GetSpecialValue("axe_range")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("axe_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("axe_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("troll_warlord_whirling_axes_ranged", troll_warlord_whirling_axes_ranged)
