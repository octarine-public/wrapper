import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_gods_strength extends Modifier {
	private cachedBonusDamage = 0
	private cachedSpeedResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return [((params?.RawDamageBase ?? 0) * this.cachedBonusDamage) / 100, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "sven_gods_strength"
		this.cachedBonusDamage = this.GetSpecialValue("gods_strength_damage", name)
		this.cachedSpeedResist = this.GetSpecialValue("bonus_slow_resistance", name)
	}
}
