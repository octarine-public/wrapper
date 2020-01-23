import Ability from "../../Base/Ability"

export default class riki_backstab extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Riki_Backstab>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_backstab", riki_backstab)
