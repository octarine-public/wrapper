import { WrapperClass } from "../../Decorators"
import { Unit } from "../Base/Unit"
import { item_urn_of_shadows } from "./item_urn_of_shadows"

@WrapperClass("item_spirit_vessel")
export class item_spirit_vessel
	extends item_urn_of_shadows
	implements IHealthRestore<Unit>
{
	public readonly HealthRestoreModifierName = "modifier_item_spirit_vessel_heal"
}
