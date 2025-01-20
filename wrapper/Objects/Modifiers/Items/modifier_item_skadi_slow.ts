import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_skadi_slow extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeedMelee = 0
	private cachedSpeedRanged = 0
	private cachedAttackSpeedMelee = 0
	private cachedAttackSpeedRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [
			this.HasMeleeAttacksBonuses()
				? this.cachedSpeedMelee
				: this.cachedSpeedRanged,
			this.IsMagicImmune()
		]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [
			this.HasMeleeAttacksBonuses()
				? this.cachedAttackSpeedMelee
				: this.cachedAttackSpeedRanged,
			this.IsMagicImmune()
		]
	}
	protected UpdateSpecialValues() {
		const name = "item_skadi"
		this.cachedSpeedMelee = this.GetSpecialValue("cold_slow_melee", name)
		this.cachedSpeedRanged = this.GetSpecialValue("cold_slow_ranged", name)
		this.cachedAttackSpeedMelee = this.GetSpecialValue("cold_attack_slow_melee", name)
		this.cachedAttackSpeedRanged = this.GetSpecialValue(
			"cold_attack_slow_ranged",
			name
		)
	}
}
