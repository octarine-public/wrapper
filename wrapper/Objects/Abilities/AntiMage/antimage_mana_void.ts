import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("antimage_mana_void")
export default class antimage_mana_void extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("mana_void_aoe_radius", level)
	}
}
