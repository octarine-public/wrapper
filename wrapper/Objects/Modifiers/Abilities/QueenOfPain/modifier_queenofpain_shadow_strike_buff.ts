import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_queenofpain_shadow_strike_buff extends Modifier {
	private cachedAttackSpeed = 0
	private cachedAS = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		if (this.cachedAttackSpeed === 0) {
			this.cachedAS = 0
			return
		}
		const caster = this.Caster
		if (caster === undefined || caster.Target === undefined) {
			this.cachedAS = 0
			return
		}
		const hasSlow = caster.Target.HasBuffByName("modifier_queenofpain_shadow_strike")
		if (!caster.IsAttacking || !hasSlow) {
			this.cachedAS = 0
			return
		}
		this.cachedAS = this.cachedAttackSpeed
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAS, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"attack_speed",
			"queenofpain_shadow_strike"
		)
	}
}
