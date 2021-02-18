import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_abyssal_blade")
export default class item_abyssal_blade extends Item {
	public static readonly AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_STUNNED

	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
	}
}
