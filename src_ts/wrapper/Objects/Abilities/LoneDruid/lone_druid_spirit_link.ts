import Ability from "../../Base/Ability"

export default class lone_druid_spirit_link extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_SpiritLink>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_spirit_link", lone_druid_spirit_link)
