import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_universal extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BECOME_UNIVERSAL,
			this.GetBecomeUniversal.bind(this)
		]
	])

	protected GetBecomeUniversal(): [number, boolean] {
		return [this.Ability?.Level ?? 0, false]
	}
}
