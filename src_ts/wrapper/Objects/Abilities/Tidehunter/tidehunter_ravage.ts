import Ability from "../../Base/Ability"

export default class tidehunter_ravage extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tidehunter_Ravage

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tidehunter_ravage", tidehunter_ravage)
