import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_windrunner_tailwind_counter extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
}
