import Ability from "../Base/Ability"

export default class magnataur_shockwave extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Magnataur_Shockwave

	public get AOERadius(): number {
		return this.GetSpecialValue("shock_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("shock_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("magnataur_shockwave", magnataur_shockwave)
