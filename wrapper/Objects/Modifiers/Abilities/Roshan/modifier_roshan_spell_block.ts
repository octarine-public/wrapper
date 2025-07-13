import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_roshan_spell_block extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE,
			this.GetStatusResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_LINKEN_PROTECTION,
			this.GetLinkenProtection.bind(this)
		]
	])
	protected GetLinkenProtection(): [number, boolean] {
		return [(this.Ability?.IsReady ?? false) ? 1 : 0, false] // 25% - no special data (maybe hardcoded)
	}
	protected GetStatusResistanceStacking(): [number, boolean] {
		return [25, false] // 25% - no special data (maybe hardcoded)
	}
}
