import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_shivas_guard_aura extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"aura_attack_speed",
			"item_shivas_guard"
		)
	}
}
