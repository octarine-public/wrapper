import Ability from "../../Base/Ability"

export default class winter_wyvern_winters_curse extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Winter_Wyvern_Winters_Curse>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("winter_wyvern_winters_curse", winter_wyvern_winters_curse)
