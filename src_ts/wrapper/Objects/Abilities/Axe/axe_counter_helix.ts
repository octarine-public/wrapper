import Ability from "../../Base/Ability"

export default class axe_counter_helix extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Axe_CounterHelix

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("axe_counter_helix", axe_counter_helix)
