import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bounty_hunter_wind_walk_fade extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
