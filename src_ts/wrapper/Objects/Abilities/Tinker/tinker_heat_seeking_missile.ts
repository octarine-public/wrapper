import Ability from "../../Base/Ability"

export default class tinker_heat_seeking_missile extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_heat_seeking_missile", tinker_heat_seeking_missile)
