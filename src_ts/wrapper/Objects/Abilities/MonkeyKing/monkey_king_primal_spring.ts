import Ability from "../../Base/Ability"

export default class monkey_king_primal_spring extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_MonkeyKing_Spring>

	public get AOERadius() {
		return this.GetSpecialValue("impact_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_primal_spring", monkey_king_primal_spring)
