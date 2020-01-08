import Ability from "../Base/Ability"

export default class rubick_fade_bolt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rubick_FadeBolt

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_fade_bolt", rubick_fade_bolt)
