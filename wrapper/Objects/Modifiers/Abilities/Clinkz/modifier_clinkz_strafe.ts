import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_clinkz_strafe extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedRange = 0
	private cachedAttackSpeed = 0
	private cachedAttackSpeedArcher = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.Parent === this.Caster
			? [this.cachedAttackSpeed, false]
			: [this.cachedAttackSpeedArcher, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "clinkz_strafe"
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_bonus", name)
		this.cachedAttackSpeedArcher = this.GetSpecialValue(
			"archer_attack_speed_pct",
			name
		)
	}
}
