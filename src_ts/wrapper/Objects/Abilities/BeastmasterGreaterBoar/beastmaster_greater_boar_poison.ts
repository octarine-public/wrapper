import Ability from "../../Base/Ability"

export default class beastmaster_greater_boar_poison extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_CallOfTheWild_Boar_PoisonGreater>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_greater_boar_poison", beastmaster_greater_boar_poison)
