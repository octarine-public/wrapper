import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_omniknight_purification_recast extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	public IsBuff(): this is IBuff {
		return true
	}
}
