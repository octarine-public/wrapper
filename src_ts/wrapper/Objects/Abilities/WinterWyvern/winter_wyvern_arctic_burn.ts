import Ability from "../../Base/Ability"

export default class winter_wyvern_arctic_burn extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Winter_Wyvern_Arctic_Burn>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("winter_wyvern_arctic_burn", winter_wyvern_arctic_burn)
