import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("night_stalker_void")
export default class night_stalker_void extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius_scepter", level)
	}
}
