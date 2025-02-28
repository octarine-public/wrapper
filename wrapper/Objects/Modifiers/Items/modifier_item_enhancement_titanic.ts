import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_titanic extends Modifier {
	private cachedDamage = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])
	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return [((params?.RawDamageBase ?? 0) * this.cachedDamage) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_titanic"
		this.cachedDamage = this.GetSpecialValue("base_attack_damage", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
