import Ability from "../../Base/Ability"

export default class kunkka_x_marks_the_spot extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Kunkka_XMarksTheSpot>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_x_marks_the_spot", kunkka_x_marks_the_spot)
