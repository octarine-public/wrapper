import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_centaur_double_edge_damage_tracking extends Modifier {
	public GetBonusDamage(_target: Unit): number {
		return this.NetworkFadeTime
	}
}
