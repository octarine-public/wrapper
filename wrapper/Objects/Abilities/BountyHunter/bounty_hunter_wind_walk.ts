import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("bounty_hunter_wind_walk")
export default class bounty_hunter_wind_walk extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
