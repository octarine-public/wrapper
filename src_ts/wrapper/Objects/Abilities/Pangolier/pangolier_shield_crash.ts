import Ability from "../../Base/Ability"

export default class pangolier_shield_crash extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Pangolier_ShieldCrash>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pangolier_shield_crash", pangolier_shield_crash)
