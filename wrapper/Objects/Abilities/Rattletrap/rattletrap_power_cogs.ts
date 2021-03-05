import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("rattletrap_power_cogs")
export default class rattletrap_power_cogs extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("cogs_radius", level)
	}
}
