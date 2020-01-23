import Ability from "../../Base/Ability"

export default class roshan_bash extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Roshan_Bash>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_bash", roshan_bash)
