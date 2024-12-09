import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_flame_cloak extends Modifier {
	public get DeltaZ(): number {
		return 100
	}
}
