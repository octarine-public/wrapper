import Ability from "../../Base/Ability"

export default class big_thunder_lizard_frenzy extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BigThunderLizard_Frenzy>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("big_thunder_lizard_frenzy", big_thunder_lizard_frenzy)
