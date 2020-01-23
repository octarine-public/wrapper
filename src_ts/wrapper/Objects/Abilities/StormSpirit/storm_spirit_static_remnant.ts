import Ability from "../../Base/Ability"

export default class storm_spirit_static_remnant extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_StormSpirit_StaticRemnant>

	public get AOERadius(): number {
		return this.GetSpecialValue("static_remnant_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("storm_spirit_static_remnant", storm_spirit_static_remnant)
