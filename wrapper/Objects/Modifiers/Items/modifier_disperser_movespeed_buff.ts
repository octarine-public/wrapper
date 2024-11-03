import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_disperser_movespeed_buff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedPurge = 0
	private cachedResist = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const remainingTime = this.RemainingTime,
			effectivePurge = (remainingTime / this.cachedPurge) * 100
		const value = this.calculateValue(effectivePurge)
		return [100 - value / this.cachedPurge, this.IsMagicImmune()]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedResist, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_disperser"
		this.cachedPurge = this.GetSpecialValue("movement_speed_buff_rate", name)
		this.cachedResist = this.GetSpecialValue("slow_resist", name)
	}

	private calculateValue(effectivePurge: number): number {
		if (effectivePurge > 80) {
			return 0
		} // 100%
		if (effectivePurge > 60) {
			return 100
		} // 80%
		if (effectivePurge > 40) {
			return 200
		} // 60%
		if (effectivePurge > 20) {
			return 300
		} // 40%
		return 400 // 20%
	}
}
