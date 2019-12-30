import Ability from "../../Base/Ability"

export default class faceless_void_chronosphere extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_FacelessVoid_Chronosphere

	public get AOERadius(): number {
		let range = this.GetSpecialValue("radius")
		let talant = this.Owner?.GetTalentValue("special_bonus_unique_faceless_void_2")!
		return range += talant !== 0 ? talant : 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_chronosphere", faceless_void_chronosphere)
