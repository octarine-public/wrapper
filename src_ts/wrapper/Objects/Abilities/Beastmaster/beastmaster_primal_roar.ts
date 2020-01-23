import Ability from "../../Base/Ability"

export default class beastmaster_primal_roar extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Beastmaster_PrimalRoar>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_primal_roar", beastmaster_primal_roar)
