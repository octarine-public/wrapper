import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_wex_intrinsic extends Modifier {
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedAttackSpeed = 0
			return
		}
		const name = "invoker_wex"
		this.cachedAttackSpeed = this.GetSpecialValue("intrinsic_attack_speed", name)

		const multiplier = owner.GetAbilityByName("special_bonus_unique_invoker_13")
		if ((multiplier?.Level ?? 0) !== 0) {
			this.cachedAttackSpeed *= 2
		}
	}
}
