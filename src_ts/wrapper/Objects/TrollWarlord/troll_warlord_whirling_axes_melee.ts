import Ability from "../Base/Ability"

export default class troll_warlord_whirling_axes_melee extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_TrollWarlord_Whirling_Axes_Melee

	public get AOERadius(): number {
		return this.GetSpecialValue("max_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("troll_warlord_whirling_axes_melee", troll_warlord_whirling_axes_melee)
