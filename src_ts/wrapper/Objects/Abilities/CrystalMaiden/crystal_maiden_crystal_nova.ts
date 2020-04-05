import Ability from "../../Base/Ability"

export default class crystal_maiden_crystal_nova extends Ability {

	public get AbilityDamage(): number {
		return this.GetSpecialValue("nova_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("crystal_maiden_crystal_nova", crystal_maiden_crystal_nova)
