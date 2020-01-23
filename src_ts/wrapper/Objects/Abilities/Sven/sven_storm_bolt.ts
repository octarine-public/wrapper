import Ability from "../../Base/Ability"

export default class sven_storm_bolt extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Sven_StormBolt>

	public get AOERadius(): number {
		return this.GetSpecialValue("bolt_aoe")
	}
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sven_storm_bolt", sven_storm_bolt)
