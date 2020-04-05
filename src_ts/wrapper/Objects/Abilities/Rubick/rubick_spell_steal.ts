import Ability from "../../Base/Ability"

export default class rubick_spell_steal extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_spell_steal", rubick_spell_steal)
