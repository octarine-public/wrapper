import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_time_dilation_slow
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "faceless_void_time_dilation"
		this.cachedSpeed = this.GetSpecialValue("slow", name)
	}
}
