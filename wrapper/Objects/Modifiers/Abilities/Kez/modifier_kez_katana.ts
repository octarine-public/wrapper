import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { kez_switch_weapons } from "../../../../Objects/Abilities/Kez/kez_switch_weapons"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { AbilityData } from "../../../DataBook/AbilityData"

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
		this.cachedRange = this.GetSpecialValue("katana_attack_range")
		this.cachedBAT = this.GetSpecialValue("katana_base_attack_time")
	}
	protected GetSpecialValue(
		specialName: string,
		abilityName: string = "kez_switch_weapons",
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const ability = this.getAbility(this.Parent)
		if (ability !== undefined) {
			return ability.GetSpecialValue(specialName, level)
		}
		const data = AbilityData.GetAbilityByName(abilityName)
		if (data === undefined) {
			return 0
		}
		this.CachedAbilityName = abilityName
		return data?.GetSpecialValue(specialName, level) ?? 0
	}
	private getAbility(
		caster: Nullable<Unit> = this.Parent
	): Nullable<kez_switch_weapons> {
		return caster?.GetAbilityByClass(kez_switch_weapons)
	}
}
