import Ability from "../../Base/Ability"

export default class undying_flesh_golem extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Undying_FleshGolem>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_flesh_golem", undying_flesh_golem)
