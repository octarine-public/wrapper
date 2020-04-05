import Ability from "../../Base/Ability"

export default class drow_ranger_marksmanship extends Ability {

	public get AOERadius(): number {
		return this.GetSpecialValue("disable_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("drow_ranger_marksmanship", drow_ranger_marksmanship)
