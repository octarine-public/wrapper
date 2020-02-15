import Ability from "../../Base/Ability"

export default class luna_lucent_beam extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Luna_LucentBeam>

	public get AbilityDamage(): number {
		return this.GetSpecialValue("beam_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_lucent_beam", luna_lucent_beam)
