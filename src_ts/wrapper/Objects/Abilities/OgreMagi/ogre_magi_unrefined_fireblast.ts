import Ability from "../../Base/Ability"

export default class ogre_magi_unrefined_fireblast extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Ogre_Magi_Unrefined_Fireblast>

	public get AbilityDamage(): number {
		return this.GetSpecialValue("fireblast_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_unrefined_fireblast", ogre_magi_unrefined_fireblast)
