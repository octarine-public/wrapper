import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_scepter_bonus_damage extends Modifier {
	public readonly ConsumedAbilityName = "item_ultimate_scepter"
}
