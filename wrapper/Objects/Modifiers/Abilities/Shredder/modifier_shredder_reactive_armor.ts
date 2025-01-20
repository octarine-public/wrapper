import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shredder_reactive_armor extends Modifier implements IBuff {
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
		return this.StackCount !== 0
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor * this.StackCount, false] // not breakable if passive disabled
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("bonus_armor", "shredder_reactive_armor")
	}
}
