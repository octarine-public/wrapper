import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_spell_extends } from "../../../Abilities/Invoker/invoker_spell_extends"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_ice_wall_slow_debuff extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue()
	}

	protected GetSpecialValue(
		specialName = "slow",
		abilityName = "invoker_ice_wall",
		_level?: number
	): number {
		return this.Ability instanceof invoker_spell_extends
			? super.GetSpecialValue(specialName, abilityName, this.Ability.QuasLevel)
			: 0
	}
}
