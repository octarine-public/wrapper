import Ability from "../../Base/Ability"

export default class magnataur_reverse_polarity extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Magnataur_ReversePolarity>

	public get AOERadius(): number {
		return this.GetSpecialValue("pull_radius")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("magnataur_reverse_polarity", magnataur_reverse_polarity)
