import Ability from "../../Base/Ability"

export default class clinkz_wind_walk extends Ability {
	public get IsInvisibilityType() {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_wind_walk", clinkz_wind_walk)
