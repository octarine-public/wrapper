import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_sai extends Modifier {
	private cachedBAT = 0
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT,
			this.GetBaseAttackTimeConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE,
			this.GetAttackBaseOverride.bind(this)
		]
	])

	protected GetBaseAttackTimeConstant(): [number, boolean] {
		return this.Ability?.IsHidden ? [0, false] : [this.cachedBAT, false]
	}

	protected GetAttackBaseOverride(): [number, boolean] {
		return this.Ability?.IsHidden ? [0, false] : [this.cachedRange, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent,
			ability = this.Ability
		if (owner === undefined || ability?.IsHidden) {
			return [0, false]
		}
		return [this.NetworkMovementSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability === undefined) {
			return
		}
		const name = this.Ability.Name
		this.cachedRange = this.GetSpecialValue("sai_attack_range", name)
		this.cachedBAT = this.GetSpecialValue("sai_base_attack_time", name)
	}
}
