import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_audacious extends Modifier {
	private cachedDamage = 0
	private cachedIncDamage = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected GetProcAttackBonusDamageMagical(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.cachedIncDamage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_audacious"
		this.cachedDamage = this.GetSpecialValue("magic_damage", name)
		this.cachedIncDamage = this.GetSpecialValue("incoming_damage", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
	}
}
