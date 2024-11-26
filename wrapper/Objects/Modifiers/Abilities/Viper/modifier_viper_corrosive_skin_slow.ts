import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_corrosive_skin_slow extends Modifier {
	private cachedMultiplier = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		// NetworkIsActive ultimate scepter multiplier
		const mul = Math.max(this.NetworkIsActive ? this.cachedMultiplier : 0, 1)
		return [-(this.cachedAttackSpeed * mul), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "viper_corrosive_skin"
		this.cachedMultiplier = this.GetSpecialValue("effect_multiplier", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
