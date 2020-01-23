import Ability from "../../Base/Ability"

export default class troll_warlord_battle_trance extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_TrollWarlord_BattleTrance>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("troll_warlord_battle_trance", troll_warlord_battle_trance)
