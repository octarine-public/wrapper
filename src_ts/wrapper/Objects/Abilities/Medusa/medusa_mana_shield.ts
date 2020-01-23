import Ability from "../../Base/Ability"

export default class medusa_mana_shield extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Medusa_ManaShield>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("medusa_mana_shield", medusa_mana_shield)
