import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_idol_of_screeauk extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private slowResistance = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.slowResistance, false]
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.slowResistance = this.GetSpecialValue("slow_resist", "item_idol_of_screeauk")
	}
}
