import Ability from "../../Base/Ability"

export default class luna_lucent_beam extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("beam_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_lucent_beam", luna_lucent_beam)
