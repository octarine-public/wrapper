import Ability from "../../Base/Ability"

export default class jakiro_dual_breath extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Jakiro_DualBreath

	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("speed_fire")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("jakiro_dual_breath", jakiro_dual_breath)
