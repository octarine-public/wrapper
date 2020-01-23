import Ability from "../../Base/Ability"

export default class winter_wyvern_splinter_blast extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Winter_Wyvern_Splinter_Blast>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("winter_wyvern_splinter_blast", winter_wyvern_splinter_blast)
