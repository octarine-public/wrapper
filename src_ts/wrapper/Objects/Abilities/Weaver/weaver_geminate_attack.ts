import Ability from "../../Base/Ability"

export default class weaver_geminate_attack extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Weaver_GeminateAttack>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("weaver_geminate_attack", weaver_geminate_attack)
