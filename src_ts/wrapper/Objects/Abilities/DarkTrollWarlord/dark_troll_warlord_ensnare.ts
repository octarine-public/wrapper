import Ability from "../../Base/Ability"

export default class dark_troll_warlord_ensnare extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DarkTrollWarlord_Ensnare
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_troll_warlord_ensnare", dark_troll_warlord_ensnare)
