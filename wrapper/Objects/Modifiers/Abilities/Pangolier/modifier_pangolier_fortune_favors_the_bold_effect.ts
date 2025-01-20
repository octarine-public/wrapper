import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pangolier_fortune_favors_the_bold_effect
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
}
