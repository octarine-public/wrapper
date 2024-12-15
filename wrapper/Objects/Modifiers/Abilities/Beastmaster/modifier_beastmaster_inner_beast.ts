import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_inner_beast extends Modifier {
	private cachedMres = 0
	private cachedASPerUnit = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, this.IsPassiveDisabled()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		let value = this.cachedAttackSpeed
		if (this.NetworkDamage !== 0) {
			value += this.cachedASPerUnit * this.NetworkDamage
		}
		return [value, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "beastmaster_inner_beast"
		this.cachedMres = this.GetSpecialValue("magic_resist", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedASPerUnit = this.GetSpecialValue("attack_speed_per_unit", name)
	}
}
