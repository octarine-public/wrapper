import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_morphling_morph_agi extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public IsBuff(): this is IBuff {
		return true
	}
}
