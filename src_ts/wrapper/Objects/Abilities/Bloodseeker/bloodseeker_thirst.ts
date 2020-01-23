import Ability from "../../Base/Ability"

export default class bloodseeker_thirst extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Bloodseeker_Thirst
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bloodseeker_thirst", bloodseeker_thirst)
