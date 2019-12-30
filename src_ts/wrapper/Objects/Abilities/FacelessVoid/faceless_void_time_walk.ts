import Ability from "../../Base/Ability"

export default class faceless_void_time_walk extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_FacelessVoid_TimeWalk
	public get BaseCastRange(): number {
		let range = this.GetSpecialValue("range")
		let talant = this.Owner?.GetTalentValue("special_bonus_unique_faceless_void")!
		return range += talant !== 0 ? talant : 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_time_walk", faceless_void_time_walk)
