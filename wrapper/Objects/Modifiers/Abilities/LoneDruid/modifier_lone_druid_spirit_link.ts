import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_spirit_link extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedBearSpeed = 0
	private cachedDruidSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [
			this.Parent?.IsSpiritBear ? this.cachedBearSpeed : this.cachedDruidSpeed,
			false
		]
	}
	protected UpdateSpecialValues(): void {
		const name = "lone_druid_spirit_link"
		this.cachedBearSpeed = this.GetSpecialValue("bonus_movement_speed_bear", name)
		this.cachedDruidSpeed = this.GetSpecialValue("bonus_movement_speed_druid", name)
	}
}
