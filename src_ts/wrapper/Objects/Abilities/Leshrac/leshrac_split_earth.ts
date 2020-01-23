import Ability from "../../Base/Ability"

export default class leshrac_split_earth extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Leshrac_Split_Earth>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("leshrac_split_earth", leshrac_split_earth)
