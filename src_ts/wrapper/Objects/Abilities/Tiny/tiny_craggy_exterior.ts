import Ability from "../../Base/Ability"

export default class tiny_craggy_exterior extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tiny_CraggyExterior>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_craggy_exterior", tiny_craggy_exterior)
