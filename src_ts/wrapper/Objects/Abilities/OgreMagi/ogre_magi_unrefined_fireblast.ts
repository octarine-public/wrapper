import Ability from "../../Base/Ability"

export default class ogre_magi_unrefined_fireblast extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("fireblast_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_unrefined_fireblast", ogre_magi_unrefined_fireblast)
