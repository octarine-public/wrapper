import Ability from "../../Base/Ability"

export default class forged_spirit_melting_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ForgedSpirit_MeltingStrike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("forged_spirit_melting_strike", forged_spirit_melting_strike)
