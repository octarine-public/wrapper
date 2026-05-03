import { AbilityImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_corrosive_breath_dot
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return true
	}
	public GetTexturePath(): string {
		return AbilityImagePath + "/dragon_knight_corrosive_png.vtex_c"
	}
}
