import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_batrider_sticky_napalm extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedMaxStacks = 0

	private get maxStackCount(): number {
		return Math.min(this.StackCount, this.cachedMaxStacks)
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.maxStackCount, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "batrider_sticky_napalm"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_pct", name)
		this.cachedMaxStacks = this.GetSpecialValue("max_stacks", name)
	}
}
