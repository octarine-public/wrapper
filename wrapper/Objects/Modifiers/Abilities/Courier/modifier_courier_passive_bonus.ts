import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_courier_passive_bonus extends Modifier {
	public static readonly MoveSpeedSlowPercentage = 15
	public static readonly MoveSpeedSlowItemNames = [
		"item_tango",
		"item_tango_single",
		"item_enchanted_mango",
		"item_faerie_fire",
		"item_clarity",
		"item_flask"
	]
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT,
			this.GetIgnoreMoveSpeedLimit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	protected GetIgnoreMoveSpeedLimit(): [number, boolean] {
		return [1, false]
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [(owner.Level - 1) * 10, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return modifier_courier_passive_bonus.MoveSpeedSlowItemNames.some(item =>
			owner.HasItemInInventory(item, true)
		)
			? [-modifier_courier_passive_bonus.MoveSpeedSlowPercentage, false]
			: [0, false]
	}
}
