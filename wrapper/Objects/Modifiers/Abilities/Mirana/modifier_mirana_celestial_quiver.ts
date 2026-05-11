import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mirana_celestial_quiver extends Modifier {
	private cachedDamage = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetPostAttackBonusDamageMagical.bind(this)
		]
	])
	protected GetPostAttackBonusDamageMagical(): [number, boolean] {
		const abil = this.Ability
		if (abil === undefined || abil.CurrentCharges === 0) {
			return [0, false]
		}
		return [this.cachedDamage, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"bonus_damage",
			"mirana_celestial_quiver",
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		)
	}
}
