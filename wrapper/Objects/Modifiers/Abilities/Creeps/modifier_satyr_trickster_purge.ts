import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_satyr_trickster_purge extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedPurge = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const remainingTime = this.RemainingTime,
			reduction = this.selfReduction(owner),
			effectivePurge = (remainingTime / (reduction * this.cachedPurge)) * 100
		const value = this.calculateValue(effectivePurge)
		return [-(100 - value / this.cachedPurge), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedPurge = this.GetSpecialValue("purge_rate", "satyr_trickster_purge")
	}

	private selfReduction(owner: Unit) {
		const modifierManager = owner.ModifierManager
		const slowResistanceUnique = modifierManager.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE
		)
		return 2 - slowResistanceUnique
	}

	private calculateValue(effectivePurge: number): number {
		if (effectivePurge > 80) {
			return 250
		} // 50%
		if (effectivePurge > 60) {
			return 300
		} // 40%
		if (effectivePurge > 40) {
			return 350
		} // 30%
		if (effectivePurge > 20) {
			return 400
		} // 20%
		return 450 // 10%
	}
}
