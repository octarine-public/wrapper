import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_spell_extends } from "../../../Abilities/Invoker/invoker_spell_extends"
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
		_level?: number
	): number {
		const ability = this.Ability
		if (!(ability instanceof invoker_spell_extends)) {
			return 0
		}
		return super.GetSpecialValue(specialName, abilityName, ability.QuasLevel)
	}
}
