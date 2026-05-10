import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_morphling_ebb_and_flow_intrinsic extends Modifier {
	private cachedSpeedPerAgi = 0
	private cachedCastRangePerStr = 0
	private cachedAttackRangePerAgi = 0
	private cachedSlowResistPerStr = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE,
			this.GetCastRangeBonusPercentage.bind(this)
		]
	])
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [(owner.TotalAgility * this.cachedSpeedPerAgi) / 100, false]
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || !owner.IsRanged) {
			return [0, false]
		}
		return [(owner.TotalAgility * this.cachedAttackRangePerAgi) / 100, false]
	}
	protected GetSlowResistanceStacking(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [(owner.TotalStrength * this.cachedSlowResistPerStr) / 100, false]
	}
	protected GetCastRangeBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [(owner.TotalStrength * this.cachedCastRangePerStr) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "morphling_ebb_and_flow"
		this.cachedSpeedPerAgi = this.GetSpecialValue("move_speed_per_agi", name)
		this.cachedCastRangePerStr = this.GetSpecialValue("cast_range_per_str", name)
		this.cachedAttackRangePerAgi = this.GetSpecialValue("attack_range_per_agi", name)
		this.cachedSlowResistPerStr = this.GetSpecialValue("slow_resist_per_str", name)
	}
}
