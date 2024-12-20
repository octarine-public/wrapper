import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_huskar_blood_magic extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CONVERT_MANA_COST_TO_HEALTH_COST,
			this.GetConvertManaCostToHealthCost.bind(this)
		]
	])

	protected GetConvertManaCostToHealthCost(): [number, boolean] {
		return [1, false]
	}
}
