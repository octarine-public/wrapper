import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_monkey_king_bar extends Modifier {
	private cachedDamage = 0
	// private cachedMagicDamage = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		// [
		// 	EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
		// 	this.GetProcAttackBonusDamageMagical.bind(this)
		// ],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	// protected GetProcAttackBonusDamageMagical(): [number, boolean] {
	// 	return [this.cachedMagicDamage, false]
	// }

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_monkey_king_bar"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		// this.cachedMagicDamage = this.GetSpecialValue("bonus_chance_damage", name)
	}
}
