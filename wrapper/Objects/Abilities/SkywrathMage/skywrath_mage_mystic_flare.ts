import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skywrath_mage_mystic_flare")
export class skywrath_mage_mystic_flare extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	// TODO: remaining damage
	// public GetBaseDamageForLevel(level: number): number {
	// 	return this.GetSpecialValue("damage", level)
	// }
}
