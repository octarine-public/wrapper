import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_static_link_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private isActive = false

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		this.isActive = this.Parent?.HasBuffByName("modifier_razor_link_vision") ?? false
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [-this.StackCount, !this.isActive]
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [-this.StackCount, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "razor_static_link"
		this.GetSpecialValue("move_speed_factor", name) // only debug
		this.GetSpecialValue("attack_speed_factor", name) // only debug
	}
}
