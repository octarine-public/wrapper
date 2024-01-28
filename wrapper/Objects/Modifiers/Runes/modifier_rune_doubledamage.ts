import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_doubledamage extends Modifier {
	public GetTexturePath(small = false) {
		return GetRuneTexture("doubledamage", small)
	}
}
