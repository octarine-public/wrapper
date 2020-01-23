import Ability from "../../Base/Ability"

export default class luna_lunar_blessing extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Luna_LunarBlessing>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_lunar_blessing", luna_lunar_blessing)
