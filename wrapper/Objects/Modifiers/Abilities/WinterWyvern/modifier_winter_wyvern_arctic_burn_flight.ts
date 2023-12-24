import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_winter_wyvern_arctic_burn_flight extends Modifier {
	public get ShouldDoFlyHeightVisual(): boolean {
		return true
	}
}
