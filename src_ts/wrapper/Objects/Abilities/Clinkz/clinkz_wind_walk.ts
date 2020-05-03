import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"

export default class clinkz_wind_walk extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_wind_walk", clinkz_wind_walk)
