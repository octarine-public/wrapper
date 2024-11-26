import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_winter_wyvern_arctic_burn_flight extends Modifier {
	public readonly ShouldDoFlyHeightVisual = true

	private cachedSpeed = 0
	private cachedRange = 0
	private cachedAttackPoint = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT,
			this.GetAttackPointConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetAttackPointConstant(): [number, boolean] {
		return [this.cachedAttackPoint, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "winter_wyvern_arctic_burn"
		this.cachedSpeed = this.GetSpecialValue("movement_scepter", name)
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", name)
		this.cachedAttackPoint = this.GetSpecialValue("attack_point", name)
	}
}
