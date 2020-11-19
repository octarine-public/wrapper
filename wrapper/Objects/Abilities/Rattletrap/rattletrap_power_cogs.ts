import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("rattletrap_power_cogs")
export default class rattletrap_power_cogs extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("cogs_radius")
	}
}
