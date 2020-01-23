import Ability from "../../Base/Ability"

export default class sven_great_cleave extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Sven_GreatCleave>

	public get AOERadius(): number {
		return this.GetSpecialValue("cleave_distance")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sven_great_cleave", sven_great_cleave)
