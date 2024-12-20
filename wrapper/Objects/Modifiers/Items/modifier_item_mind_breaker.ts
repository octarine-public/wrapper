import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mind_breaker extends Modifier {
	private cachedAttackSpeed = 0
	private cachedPreAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetPreAttackBonusDamageMagical.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected GetPreAttackBonusDamageMagical(): [number, boolean] {
		return [this.cachedPreAttackDamage, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_mind_breaker"
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
		this.cachedPreAttackDamage = this.GetSpecialValue("magic_damage", name)
	}
}
