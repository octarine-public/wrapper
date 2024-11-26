import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_monkey_king_bounce_perch extends Modifier {
	public readonly ShouldDoFlyHeightVisual = true
	public get DeltaZ(): number {
		return 100
	}
}
