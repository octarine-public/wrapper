import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tinker_warp_grenade extends Modifier implements IDebuff, IDisable {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedRange = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE,
			this.GetCastRangeBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE,
			this.GetAttackRangeBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetCastRangeBonusPercentage(): [number, boolean] {
		return [-this.cachedCastRange, this.IsMagicImmune()]
	}
	protected GetAttackRangeBonusPercentage(): [number, boolean] {
		return [-this.cachedRange, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue("range_reduction", "tinker_warp_grenade")
		this.cachedCastRange = this.cachedRange
	}
}
