import Ability from "../../Base/Ability"

export default class chen_divine_favor extends Ability {

	public get AuraRadius(): number {
		return this.GetSpecialValue("aura_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chen_divine_favor", chen_divine_favor)
