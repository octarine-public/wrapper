import Ability from "../../Base/Ability"

export default class dark_seer_vacuum extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkSeer_Vacuum

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_vacuum", dark_seer_vacuum)
