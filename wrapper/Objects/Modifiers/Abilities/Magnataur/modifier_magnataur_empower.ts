import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_magnataur_empower extends Modifier {
	private cachedDamage = 0
	private cachedMultiplier = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(
		_params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		if (owner !== caster) {
			return [this.cachedDamage, false]
		}
		return [this.cachedDamage * (1 + this.cachedMultiplier / 100), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "magnataur_empower"
		this.cachedDamage = this.GetSpecialValue("bonus_damage_pct", name)
		this.cachedMultiplier = this.GetSpecialValue("self_multiplier", name)
	}
}
