import Ability from "../../Base/Ability"

export default class dazzle_poison_touch extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Dazzle_Poison_Touch

	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}

	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}

	public get Range(): number {
		return this.GetSpecialValue("end_distance")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_poison_touch", dazzle_poison_touch)
