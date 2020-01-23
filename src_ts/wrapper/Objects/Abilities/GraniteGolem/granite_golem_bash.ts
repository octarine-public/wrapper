import Ability from "../../Base/Ability"

export default class granite_golem_bash extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_GraniteGolem_Bash>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("granite_golem_bash", granite_golem_bash)
