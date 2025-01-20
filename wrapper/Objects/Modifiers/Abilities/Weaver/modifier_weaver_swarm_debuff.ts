import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_weaver_swarm_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0
	private cachedArmorAttackRate = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		const attackRate = this.cachedArmorAttackRate,
			value = 1 + (this.ElapsedTime / attackRate) * this.cachedArmor
		return [-value, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "weaver_the_swarm"
		this.cachedArmor = this.GetSpecialValue("armor_reduction", name)
		this.cachedArmorAttackRate = this.GetSpecialValue("attack_rate", name)
	}
}
