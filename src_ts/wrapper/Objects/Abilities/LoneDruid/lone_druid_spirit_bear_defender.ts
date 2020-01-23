import Ability from "../../Base/Ability"

export default class lone_druid_spirit_bear_defender extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_SpiritBear_Defender>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_spirit_bear_defender", lone_druid_spirit_bear_defender)
