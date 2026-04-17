import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_batrider_firefly extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [
			Math.remapRange(this.ElapsedTime, 0, this.Duration, 0, this.cachedSpeed),
			false
		]
	}
	protected UpdateSpecialValues(): void {
		const name = "batrider_firefly"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_pct_total", name)
	}
}
