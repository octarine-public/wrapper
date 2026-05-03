import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_time_dilation_selfbuff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden: boolean = false
	public readonly BuffModifierName: string = this.Name

	private cachedSpeed = 0
	private cachedAttackSpeed = 0

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
	public IsBuff(): this is IBuff {
		return true
	}
	public GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed * this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "faceless_void_time_dilation"
		this.cachedSpeed = this.GetSpecialValue("self_movespeed_tooltip", name)
		this.cachedAttackSpeed = this.GetSpecialValue("self_attackspeed_tooltip", name)
	}
}
