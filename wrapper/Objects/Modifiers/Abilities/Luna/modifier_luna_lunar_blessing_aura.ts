import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_lunar_blessing_aura extends Modifier {
	private cachedDamage = 0
	private cachedDamageSelf = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		const caster = this.Caster
		if (caster === undefined) {
			return [0, false]
		}
		const value = caster === this.Parent ? this.cachedDamageSelf : this.cachedDamage
		return [value * caster.Level, this.IsPassiveDisabled(caster)]
	}

	protected UpdateSpecialValues(): void {
		const name = "luna_lunar_blessing"
		this.cachedDamage = this.GetSpecialValue("bonus_damage_per_level", name)
		this.cachedDamageSelf = this.GetSpecialValue("self_bonus_damage_per_level", name)
	}
}
