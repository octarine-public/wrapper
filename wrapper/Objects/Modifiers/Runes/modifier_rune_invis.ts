import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_invis extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public get ForceVisible() {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("invis", small)
	}
}
