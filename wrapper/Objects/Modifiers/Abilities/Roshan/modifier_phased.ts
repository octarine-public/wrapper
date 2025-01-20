import { AbilityImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phased extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public GetTexturePath(): string {
		return AbilityImagePath + "/phased_modifier_png.vtex_c"
	}
	public IsBuff(): this is IBuff {
		return true
	}
}
