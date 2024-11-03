import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_ghost_walk } from "../../../Abilities/Invoker/invoker_ghost_walk"
import { invoker_ghost_walk_ad } from "../../../Abilities/Invoker/invoker_ghost_walk_ad"
import { Ability } from "../../../Base/Ability"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_ghost_walk_enemy extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue()
	}

	protected GetSpecialValue(
		specialName = "enemy_slow",
		abilityName = "invoker_ghost_walk",
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const ability = this.Ability
		if (!this.ShouldBeValidSpell(ability)) {
			return 0
		}
		return super.GetSpecialValue(
			specialName,
			abilityName,
			Math.max(ability.QuasLevel + level, level) // quas level
		)
	}

	protected ShouldBeValidSpell(
		ability: Nullable<Ability>
	): ability is invoker_ghost_walk | invoker_ghost_walk_ad {
		return (
			ability instanceof invoker_ghost_walk ||
			ability instanceof invoker_ghost_walk_ad
		)
	}
}
