import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_shaman_chicken_speed extends Modifier implements IBuff {
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
	public GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"movespeed_bonus_pct",
			"shadow_shaman_fowl_play"
		)
	}
}
