import Ability from "../../Base/Ability"

export default class night_stalker_darkness extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_NightStalker_Darkness>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("night_stalker_darkness", night_stalker_darkness)
