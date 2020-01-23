import Ability from "../../Base/Ability"

export default class chen_holy_persuasion extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Chen_HolyPersuasion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chen_holy_persuasion", chen_holy_persuasion)
