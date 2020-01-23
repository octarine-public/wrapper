import Ability from "../../Base/Ability"

export default class spirit_breaker_bulldoze extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SpiritBreaker_Bulldoze>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spirit_breaker_bulldoze", spirit_breaker_bulldoze)
