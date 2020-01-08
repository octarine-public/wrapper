import Ability from "../Base/Ability"

export default class wisp_spirits extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Wisp_Spirits

	public get AOERadius(): number {
		return this.GetSpecialValue("hit_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_spirits", wisp_spirits)
