import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dustofappearance extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.CalculateModifierMoveSpeedPercentage.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return true
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected CalculateModifierMoveSpeedPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [owner.IsInvisible ? this.NetworkMovementSpeed : 0, this.IsMagicImmune()]
	}
}
