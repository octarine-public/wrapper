import Ability from "../../Base/Ability"

export default class pangolier_swashbuckle extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Pangolier_Swashbuckle>

	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("dash_speed")
	}
	public get BaseCastRange(): number {
		return this.GetSpecialValue("dash_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pangolier_swashbuckle", pangolier_swashbuckle)
