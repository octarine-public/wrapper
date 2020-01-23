import Ability from "../../Base/Ability"

export default class luna_moon_glaive extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Luna_MoonGlaive>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_moon_glaive", luna_moon_glaive)
