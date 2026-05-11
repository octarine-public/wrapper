import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_colossal extends Modifier {
	private cachedHpPerThreshold = 100
	private cachedBaseSlowResist = 0
	private cachedSlowResistPerThreshold = 0
	private cachedBaseAOE = 0
	private cachedAOEPerThreshold = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistance.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE,
			this.GetAOEBonusPercentage.bind(this)
		]
	])
	private get thresholds(): number {
		const owner = this.Parent
		if (owner === undefined || this.cachedHpPerThreshold <= 0) {
			return 0
		}
		return Math.max(Math.floor(owner.MaxHP / this.cachedHpPerThreshold), 0)
	}
	protected GetSlowResistance(): [number, boolean] {
		const bonus =
			this.cachedBaseSlowResist +
			this.thresholds * this.cachedSlowResistPerThreshold
		return [bonus, this.IsPassiveDisabled()]
	}
	protected GetAOEBonusPercentage(): [number, boolean] {
		const bonus = this.cachedBaseAOE + this.thresholds * this.cachedAOEPerThreshold
		return [100 + bonus, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "primal_beast_colossal"
		this.cachedHpPerThreshold = Math.max(
			this.GetSpecialValue("hp_per_threshold", name),
			1
		)
		this.cachedBaseSlowResist = this.GetSpecialValue("base_slow_resist", name)
		this.cachedSlowResistPerThreshold = this.GetSpecialValue(
			"slow_resistance_per_threshold",
			name
		)
		this.cachedBaseAOE = this.GetSpecialValue("base_aoe", name)
		this.cachedAOEPerThreshold = this.GetSpecialValue("aoe_per_threshold", name)
	}
}
