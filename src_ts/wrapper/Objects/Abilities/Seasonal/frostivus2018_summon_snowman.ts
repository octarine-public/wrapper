import Ability from "../../Base/Ability"

export default class frostivus2018_summon_snowman extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Frostivus2018_Summon_Snowman>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("frostivus2018_summon_snowman", frostivus2018_summon_snowman)
