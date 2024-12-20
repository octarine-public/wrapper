import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_dragon_form extends Modifier {
	private cachedSpeed = 0
	private cachedRange = 0
	private cachedBonusDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	public OnHasScepterChanged(): void {
		// not needed
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_elder_dragon_form"
		this.cachedRange = this.GetSpecialValue("bonus_attack_range", name)
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", name)
		this.cachedBonusDamage = this.GetSpecialValue("bonus_attack_damage", name)
	}

	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const hasScepter = this.Caster?.HasScepter ?? false
		return super.GetSpecialValue(
			specialName,
			abilityName,
			hasScepter ? level + 1 : level
		)
	}
}
