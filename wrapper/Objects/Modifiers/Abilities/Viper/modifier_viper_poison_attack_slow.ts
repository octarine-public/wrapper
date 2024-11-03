import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_poison_attack_slow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private maxStacks = 0
	private cachedSpeed = 0

	private get MaxStackCount(): number {
		return Math.min(this.StackCount, this.maxStacks)
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.MaxStackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "viper_poison_attack"
		this.maxStacks = this.GetSpecialValue("max_stacks", name)
		this.cachedSpeed = this.GetSpecialValue("movement_speed", name)
	}
}
