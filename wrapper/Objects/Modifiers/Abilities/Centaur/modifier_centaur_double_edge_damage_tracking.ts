import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_centaur_double_edge_damage_tracking
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public get StackCount(): number {
		return this.NetworkFadeTime
	}

	public GetBonusDamage(_target: Unit): number {
		return this.NetworkFadeTime
	}

	public IsBuff(): this is IBuff {
		return this.NetworkFadeTime !== 0
	}
}
