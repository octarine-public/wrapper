import Ability from "../../Base/Ability"

export default class zuus_arc_lightning extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Zuus_ArcLightning>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("zuus_arc_lightning", zuus_arc_lightning)
