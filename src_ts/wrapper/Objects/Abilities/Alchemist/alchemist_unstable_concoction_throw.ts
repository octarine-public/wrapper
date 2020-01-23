import Ability from "../../Base/Ability"

export default class alchemist_unstable_concoction_throw extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Alchemist_UnstableConcoctionThrow>

	public get AOERadius(): number {
		return this.GetSpecialValue("midair_explosion_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("alchemist_unstable_concoction_throw", alchemist_unstable_concoction_throw)
