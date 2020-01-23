import Ability from "../../Base/Ability"

export default class troll_warlord_berserkers_rage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_TrollWarlord_BerserkersRage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("troll_warlord_berserkers_rage", troll_warlord_berserkers_rage)
