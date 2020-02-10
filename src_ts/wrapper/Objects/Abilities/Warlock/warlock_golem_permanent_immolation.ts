import Ability from "../../Base/Ability"

export default class warlock_golem_permanent_immolation extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Warlock_Golem_Permanent_Immolation>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_golem_permanent_immolation", warlock_golem_permanent_immolation)