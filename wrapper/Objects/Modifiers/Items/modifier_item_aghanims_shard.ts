import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_aghanims_shard extends Modifier {
	public readonly IsHidden = true
	public readonly ConsumedAbilityName = "item_aghanims_shard"
}
