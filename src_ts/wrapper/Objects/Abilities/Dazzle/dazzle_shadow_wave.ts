import Ability from "../../Base/Ability"

export default class dazzle_shadow_wave extends Ability {

	public get AOERadius(): number {
		return this.GetSpecialValue("damage_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_shadow_wave", dazzle_shadow_wave)
