import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_viscous_nasal_goo extends Modifier implements IDebuff {
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedBaseSpeed = 0

	private cachedArmor = 0
	private cachedBaseArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		const perStack = this.cachedArmor * this.StackCount
		return [-(perStack + this.cachedBaseArmor), this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const perStack = this.cachedSpeed * this.StackCount
		return [-(perStack + this.cachedBaseSpeed), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_viscous_nasal_goo"
		this.cachedArmor = this.GetSpecialValue("armor_per_stack", name)
		this.cachedSpeed = this.GetSpecialValue("move_slow_per_stack", name)
		this.cachedBaseArmor = this.GetSpecialValue("base_armor", name)
		this.cachedBaseSpeed = this.GetSpecialValue("base_move_slow", name)
	}
}
