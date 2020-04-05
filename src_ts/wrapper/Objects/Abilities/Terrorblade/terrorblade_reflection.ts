import Ability from "../../Base/Ability"

export default class terrorblade_reflection extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("terrorblade_reflection", terrorblade_reflection)
