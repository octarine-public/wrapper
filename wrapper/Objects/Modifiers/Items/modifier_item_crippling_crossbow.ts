import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_crippling_crossbow extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const elapsed = this.RemainingTime,
			maxDuration = this.Duration,
			eff = Math.remapRange(elapsed, 0, maxDuration, 0, 1)
		return [-(this.cachedSpeed * eff), this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("slow_pct", "item_crippling_crossbow")
	}
}
