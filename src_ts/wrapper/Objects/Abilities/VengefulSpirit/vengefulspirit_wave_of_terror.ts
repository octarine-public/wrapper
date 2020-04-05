import Ability from "../../Base/Ability"

export default class vengefulspirit_wave_of_terror extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("wave_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("wave_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("vengefulspirit_wave_of_terror", vengefulspirit_wave_of_terror)
