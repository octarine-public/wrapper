import Ability from "../../Base/Ability"

export default class polar_furbolg_ursa_warrior_thunder_clap extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_PolarFurbolgUrsaWarrior_ThunderClap>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("polar_furbolg_ursa_warrior_thunder_clap", polar_furbolg_ursa_warrior_thunder_clap)
