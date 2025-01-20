import { ImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_slow_burn extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public GetTexturePath(): string {
		return ImagePath + "/hud/facets/icons/nuke_png.vtex_c"
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
}
