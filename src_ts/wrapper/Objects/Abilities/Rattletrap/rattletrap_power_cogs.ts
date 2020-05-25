import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("rattletrap_power_cogs")
export default class rattletrap_power_cogs extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("cogs_radius")
	}
}
