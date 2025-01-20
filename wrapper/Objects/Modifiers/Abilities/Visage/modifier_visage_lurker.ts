import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_lurker extends Modifier {
	public readonly IsHidden = false

	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
}
