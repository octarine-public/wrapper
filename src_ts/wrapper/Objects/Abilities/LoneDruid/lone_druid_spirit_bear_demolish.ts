import Ability from "../../Base/Ability"

export default class lone_druid_spirit_bear_demolish extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_SpiritBear_Demolish>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_spirit_bear_demolish", lone_druid_spirit_bear_demolish)
