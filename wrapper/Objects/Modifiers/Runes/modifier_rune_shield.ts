import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_shield extends Modifier {
	public readonly HasVisualShield = true

	public GetTexturePath(small = false) {
		return GetRuneTexture("shield", small)
	}
}
