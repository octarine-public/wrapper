import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pudge_innate_graft_flesh extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
}
