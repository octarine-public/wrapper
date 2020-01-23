import Ability from "../../Base/Ability"

export default class skywrath_mage_mystic_flare extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Skywrath_Mage_Mystic_Flare>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skywrath_mage_mystic_flare", skywrath_mage_mystic_flare)
