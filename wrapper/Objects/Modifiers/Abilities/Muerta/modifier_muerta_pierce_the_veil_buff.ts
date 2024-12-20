import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_pierce_the_veil_buff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL,
			this.GetProcAttackConvertPhysicalToMagical.bind(this)
		]
	])

	protected GetProcAttackConvertPhysicalToMagical(): [number, boolean] {
		return [1, false]
	}
}
