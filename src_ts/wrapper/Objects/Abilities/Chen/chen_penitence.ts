import Ability from "../../Base/Ability"

export default class chen_penitence extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Chen_Penitence
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chen_penitence", chen_penitence)
