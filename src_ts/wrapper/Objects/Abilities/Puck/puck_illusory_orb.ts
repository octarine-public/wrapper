import Ability from "../../Base/Ability"

export default class puck_illusory_orb extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Puck_IllusoryOrb>

	public get BaseCastRange(): number {
		return this.GetSpecialValue("max_distance")
	}

	public get Speed(): number {
		return this.GetSpecialValue("orb_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("puck_illusory_orb", puck_illusory_orb)
