import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_culling_blade_permanent extends Modifier implements IBuff {
	public readonly IsHidden: boolean = false
	public readonly BuffModifierName = this.Name

	private cacheArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cacheArmor * this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		this.cacheArmor = this.GetSpecialValue("armor_per_stack", "axe_culling_blade")
	}
}
