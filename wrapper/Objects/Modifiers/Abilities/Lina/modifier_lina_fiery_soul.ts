import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_fiery_soul extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedStacks = 0

	public get MaxStacks(): number {
		return Math.min(this.StackCount, this.cachedStacks)
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.MaxStacks, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lina_fiery_soul"
		this.cachedSpeed = this.GetSpecialValue("fiery_soul_move_speed_bonus", name)
		this.cachedStacks = this.GetSpecialValue("fiery_soul_max_stacks", name)
	}
}
