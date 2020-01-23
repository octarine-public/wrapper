import Ability from "../../Base/Ability"

export default class shredder_whirling_death extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Shredder_WhirlingDeath>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shredder_whirling_death", shredder_whirling_death)
