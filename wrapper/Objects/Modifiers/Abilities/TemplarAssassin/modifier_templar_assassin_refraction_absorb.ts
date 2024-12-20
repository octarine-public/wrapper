import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_templar_assassin_refraction_absorb extends Modifier {
	public readonly HasVisualShield = true

	private cachedShield = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AVOID_DAMAGE,
			this.GetAvoidDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	protected GetAvoidDamage(): [number, boolean] {
		return [this.StackCount !== 0 ? 1 : 0, false]
	}

	protected GetTotalConstantBlock(): [number, boolean] {
		const value = this.cachedShield * this.StackCount
		return [value - this.NetworkDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue(
			"shield_per_instance",
			"templar_assassin_refraction"
		)
	}
}
