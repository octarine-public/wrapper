import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_katana extends Modifier {
	private cachedBAT = 0
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT,
			this.GetBaseAttackTimeConstant.bind(this)
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

	protected UpdateSpecialValues(): void {
		// Valve replace ability if there is a shard
		if (this.Ability === undefined) {
			return
		}
		const name = this.Ability.Name
		this.cachedRange = this.GetSpecialValue("katana_attack_range", name)
		this.cachedBAT = this.GetSpecialValue("katana_base_attack_time", name)
	}
}
