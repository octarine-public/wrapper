import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_unleash_flurry_cooldown extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedFixedAttackRate = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE,
			this.GetFixedAttackRate.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetFixedAttackRate(): [number, boolean] {
		return [this.cachedFixedAttackRate, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedFixedAttackRate = this.GetSpecialValue(
			"recovery_fixed_attack_rate",
			"marci_unleash"
		)
	}
}
