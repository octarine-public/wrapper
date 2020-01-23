import Ability from "../../Base/Ability"

export default class huskar_life_break extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Huskar_Life_Break>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("huskar_life_break", huskar_life_break)
