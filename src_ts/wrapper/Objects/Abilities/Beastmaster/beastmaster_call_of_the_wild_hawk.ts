import Ability from "../../Base/Ability"

export default class beastmaster_call_of_the_wild_hawk extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Beastmaster_CallOfTheWild_Hawk>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_call_of_the_wild_hawk", beastmaster_call_of_the_wild_hawk)
