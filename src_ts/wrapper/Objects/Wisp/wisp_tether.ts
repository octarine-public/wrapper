import Ability from "../Base/Ability"

export default class wisp_tether extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Wisp_Tether

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_tether", wisp_tether)
