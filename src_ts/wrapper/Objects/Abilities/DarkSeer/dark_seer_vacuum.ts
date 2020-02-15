import Ability from "../../Base/Ability"

export default class dark_seer_vacuum extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DarkSeer_Vacuum
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_vacuum", dark_seer_vacuum)
