import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dragon_knight_dragon_form extends Modifier {
	private cachedSpeed = 0
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_elder_dragon_form"
		this.cachedRange = this.GetSpecialValue("bonus_attack_range", name)
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", name)
	}

	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		if (this.hasBlackDragon(this.Caster)) {
			level += 1
		}
		return super.GetSpecialValue(specialName, abilityName, level)
	}

	private hasBlackDragon(caster: Nullable<Unit>): boolean {
		return caster !== undefined
			? caster.HasBuffByName("modifier_dragon_knight_black_dragon_tooltip")
			: false
	}
}
