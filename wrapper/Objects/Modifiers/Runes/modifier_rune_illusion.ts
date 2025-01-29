import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_illusion extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("illusion", small)
	}
}
