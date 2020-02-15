import Ability from "../../Base/Ability"

export default class zuus_arc_lightning extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Zuus_ArcLightning>

	public get AbilityDamage(): number {
		return this.GetSpecialValue("arc_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("zuus_arc_lightning", zuus_arc_lightning)
