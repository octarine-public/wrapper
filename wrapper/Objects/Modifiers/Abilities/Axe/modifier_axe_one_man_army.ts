import { ImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_one_man_army extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	public GetTexturePath(): string {
		return ImagePath + "/hud/facets/icons/strength_png.vtex_c"
	}

	public IsBuff(): this is IBuff {
		return true
	}
}
