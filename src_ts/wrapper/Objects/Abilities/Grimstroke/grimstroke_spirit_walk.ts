import Ability from "../../Base/Ability"

export default class grimstroke_spirit_walk extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Grimstroke_SpiritWalk>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("grimstroke_spirit_walk", grimstroke_spirit_walk)
