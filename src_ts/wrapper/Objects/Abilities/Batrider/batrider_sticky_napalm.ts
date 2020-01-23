import Ability from "../../Base/Ability"

export default class batrider_sticky_napalm extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Batrider_StickyNapalm>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("batrider_sticky_napalm", batrider_sticky_napalm)
