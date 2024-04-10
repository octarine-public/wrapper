import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_AMPLIFY } from "../../../../Enums/DAMAGE_AMPLIFY"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bounty_hunter_wind_walk extends Modifier {
	public readonly DamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL
	public readonly AmplifyDamage = DAMAGE_AMPLIFY.DAMAGE_AMPLIFY_INCOMING

	protected SetDamageReduction(specialName = "damage_reduction_pct", subtract = true) {
		super.SetDamageReduction(specialName, subtract)
	}
}
