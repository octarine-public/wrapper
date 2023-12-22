import { WrapperClassModifier } from "../../../Decorators"
import { modifierstate } from "../../../Enums/modifierstate"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_parting_shot_physical_body_debuff extends Modifier {
	protected readonly State =
		(1n << BigInt(modifierstate.MODIFIER_STATE_STUNNED)) |
		(1n << BigInt(modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED))
}
