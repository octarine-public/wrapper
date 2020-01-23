import Ability from "../../Base/Ability"

export default class faceless_void_chronosphere extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_FacelessVoid_Chronosphere>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius") + (this.Owner?.GetTalentValue("special_bonus_unique_faceless_void_2") ?? 0)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_chronosphere", faceless_void_chronosphere)
