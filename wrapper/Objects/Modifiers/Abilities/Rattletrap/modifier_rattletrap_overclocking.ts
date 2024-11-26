import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_overclocking extends Modifier {
	private cachedAS = 0
	private cachedAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined || !owner.HasScepter) {
			this.cachedAS = 0
			return
		}
		this.cachedAS = owner.HasBuffByName("modifier_rattletrap_cog_self_bonuses")
			? this.cachedAttackSpeed
			: 0
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAS, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"bonus_attack_speed",
			"rattletrap_overclocking"
		)
	}
}
