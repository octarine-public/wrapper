import Ability from "../../Base/Ability"

export default class warlock_golem_flaming_fists extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Warlock_Golem_Flaming_Fists>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_golem_flaming_fists", warlock_golem_flaming_fists)
