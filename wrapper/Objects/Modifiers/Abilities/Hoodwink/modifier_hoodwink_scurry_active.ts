import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_scurry_active extends Modifier {
	private cachedSpeed = 0
	private cachedRange = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "hoodwink_scurry"
		this.cachedRange = this.GetSpecialValue("attack_range", name)
		this.cachedSpeed = this.GetSpecialValue("movement_speed_pct", name)
		this.cachedCastRange = this.GetSpecialValue("cast_range", name)
	}
}
