import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_berserkers_call_armor extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("bonus_armor", "axe_berserkers_call")
	}
}
