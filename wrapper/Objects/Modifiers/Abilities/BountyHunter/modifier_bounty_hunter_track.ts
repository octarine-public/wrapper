import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bounty_hunter_track extends Modifier {
	public readonly IsVisibleForEnemies = true
}
