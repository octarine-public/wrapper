import Ability from "../../Base/Ability"

export default class mud_golem_rock_destroy extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_MudGolem_RockDestroy>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mud_golem_rock_destroy", mud_golem_rock_destroy)
