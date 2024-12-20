import { Paths } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_one_man_army extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	public GetTexturePath(): string {
		return Paths.Images + "/hud/facets/icons/strength_png.vtex_c"
	}

	public IsBuff(): this is IBuff {
		return true
	}
}
