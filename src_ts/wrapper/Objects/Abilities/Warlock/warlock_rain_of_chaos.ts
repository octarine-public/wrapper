import Ability from "../../Base/Ability"

export default class warlock_rain_of_chaos extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Warlock_RainOfChaos

	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_rain_of_chaos", warlock_rain_of_chaos)
