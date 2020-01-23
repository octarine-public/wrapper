import Ability from "../../Base/Ability"

export default class lone_druid_spirit_bear_return extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_SpiritBear_Return>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_spirit_bear_return", lone_druid_spirit_bear_return)
