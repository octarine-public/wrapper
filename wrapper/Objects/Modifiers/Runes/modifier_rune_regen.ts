import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_regen extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public get ForceVisible() {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("regen", small)
	}
}
