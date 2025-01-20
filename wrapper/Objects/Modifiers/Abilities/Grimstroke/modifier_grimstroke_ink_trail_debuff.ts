import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_grimstroke_ink_trail_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
}
