import Ability from "../../Base/Ability"

export default class warlock_upheaval extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Warlock_Upheaval

	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_upheaval", warlock_upheaval)
