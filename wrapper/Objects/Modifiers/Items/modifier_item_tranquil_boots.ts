import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Item } from "../../Base/Item"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_tranquil_boots extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
			this.GetMoveSpeedBonusUnique.bind(this)
		]
	])

	private speedBonus = 0
	private breakCount = 0
	private speedBonusBroken = 0

	protected GetMoveSpeedBonusUnique(): [number, boolean] {
		const item = this.Ability as Nullable<Item>
		if (item === undefined || this.Parent === undefined) {
			return [0, false]
		}
		const isIllusion = this.Parent.IsIllusion
		return [
			isIllusion || item.CurrentCharges >= this.breakCount
				? this.speedBonusBroken
				: this.speedBonus,
			false
		]
	}

	protected UpdateSpecialValues() {
		const name = "item_tranquil_boots"
		this.breakCount = this.GetSpecialValue("break_count", name)
		this.speedBonus = this.GetSpecialValue("bonus_movement_speed", name)
		this.speedBonusBroken = this.GetSpecialValue("broken_movement_speed", name)
	}
}
