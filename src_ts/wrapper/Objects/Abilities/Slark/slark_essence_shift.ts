import Ability from "../../Base/Ability"

export default class slark_essence_shift extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Slark_EssenceShift>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slark_essence_shift", slark_essence_shift)
