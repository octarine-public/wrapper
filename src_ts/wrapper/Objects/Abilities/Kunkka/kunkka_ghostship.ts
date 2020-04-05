import Ability from "../../Base/Ability"

export default class kunkka_ghostship extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("ghostship_width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_ghostship", kunkka_ghostship)
