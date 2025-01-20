import { ImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phoenix_dying_light_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public GetTexturePath(): string {
		return ImagePath + "/hud/facets/icons/barrier_png.vtex_c"
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
}
