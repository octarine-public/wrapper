import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_courier_shield extends Modifier implements IShield {
	public readonly IsHidden = false
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[EModifierfunction.MODIFIER_PROPERTY_AVOID_DAMAGE, this.GetAvoidDamage.bind(this)]
	])

	public IsShield(): this is IShield {
		return true
	}
	protected GetAvoidDamage(): [number, boolean] {
		return [1, false]
	}
}
