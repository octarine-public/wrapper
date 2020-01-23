import Ability from "../../Base/Ability"

export default class roshan_devotion extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Roshan_Devotion>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_devotion", roshan_devotion)
