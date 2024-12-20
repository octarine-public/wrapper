import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_butterfly extends Modifier {
	private cachedDamage = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const baseInc = owner.BaseAttackSpeedIncrease,
			value = baseInc * (this.cachedAttackSpeed / 100)
		return [value, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_butterfly"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed_pct", name)
	}
}
