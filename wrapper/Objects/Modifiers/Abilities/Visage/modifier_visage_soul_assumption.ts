import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_soul_assumption extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamagePerStack = 0

	public get BonusDamage(): number {
		return this.cachedDamagePerStack * this.StackCount
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamagePerStack = this.GetSpecialValue(
			"soul_charge_damage",
			"visage_soul_assumption"
		)
	}
}
