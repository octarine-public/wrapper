import Ability from "../../Base/Ability"

export default class bounty_hunter_wind_walk extends Ability {
	public get IsInvisibilityType() {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bounty_hunter_wind_walk", bounty_hunter_wind_walk)
