import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_ice_wall } from "../../../Abilities/Invoker/invoker_ice_wall"
import { invoker_ice_wall_ad } from "../../../Abilities/Invoker/invoker_ice_wall_ad"
import { Ability } from "../../../Base/Ability"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_ice_wall_slow_debuff extends Modifier {
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
		specialName = "slow",
		abilityName = "invoker_ice_wall",
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const ability = this.Ability
		if (!this.shouldBeValidSpell(ability)) {
			return 0
		}
		level = Math.max(ability.QuasLevel + level, level)
		return super.GetSpecialValue(specialName, abilityName, level)
	}

	private shouldBeValidSpell(
		ability: Nullable<Ability>
	): ability is invoker_ice_wall | invoker_ice_wall_ad {
		return (
			ability instanceof invoker_ice_wall || ability instanceof invoker_ice_wall_ad
		)
	}
}
