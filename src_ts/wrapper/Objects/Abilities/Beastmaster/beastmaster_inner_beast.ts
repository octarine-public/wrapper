import Ability from "../../Base/Ability"

export default class beastmaster_inner_beast extends Ability {
	public get AuraRadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_inner_beast", beastmaster_inner_beast)
